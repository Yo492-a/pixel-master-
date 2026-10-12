import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const bad = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    select: { orderNumber: true, price: true, status: true },
  });
  if (!order) return bad("الطلب غير موجود", 404);

  const methods = await prisma.paymentMethod.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  const qrIds = methods
    .map((m) => m.qrMediaId)
    .filter((x): x is string => !!x);
  const qrs = qrIds.length
    ? await prisma.media.findMany({
        where: { id: { in: qrIds } },
        select: { id: true, url: true },
      })
    : [];
  const qrMap = new Map(qrs.map((q) => [q.id, q.url] as const));

  return NextResponse.json({
    orderNumber: order.orderNumber,
    price: order.price.toString(),
    status: order.status,
    methods: methods.map((m) => ({
      id: m.id,
      name: m.name,
      accountNumber: m.accountNumber,
      instructions: m.instructions,
      qrUrl: m.qrMediaId ? qrMap.get(m.qrMediaId) ?? null : null,
    })),
  });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  let b: { methodId?: unknown; txn?: unknown };
  try {
    b = await req.json();
  } catch {
    return bad("طلب غير صالح");
  }
  const methodId = typeof b.methodId === "string" ? b.methodId : "";
  const txn = typeof b.txn === "string" ? b.txn.trim() : "";
  if (!methodId || txn.length < 4 || txn.length > 100) {
    return bad("اكتب رقم العملية بشكل صحيح");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    select: { status: true, price: true, notes: true },
  });
  if (!order) return bad("الطلب غير موجود", 404);
  if (order.status !== "AWAITING_PAYMENT") {
    return bad("هذا الطلب ما بيقبل تأكيد دفع حالياً");
  }
  if (Number(order.price) <= 0) return bad("السعر لسا ما انحدد");

  const method = await prisma.paymentMethod.findFirst({
    where: { id: methodId, isActive: true },
  });
  if (!method) return bad("طريقة الدفع غير متاحة");

  const notes =
    `${order.notes ?? ""}\n\n— دفع عبر ${method.name} — رقم العملية: ${txn}`.trim();

  await prisma.order.update({
    where: { id: params.id },
    data: {
      paymentMethodId: method.id,
      notes,
      status: "PAYMENT_UNDER_REVIEW",
    },
  });
  await prisma.orderStatusEvent.create({
    data: {
      orderId: params.id,
      status: "PAYMENT_UNDER_REVIEW",
      note: `رقم العملية: ${txn}`,
    },
  });
  return NextResponse.json({ ok: true });
}
