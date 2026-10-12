import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

const STATUSES = [
  "AWAITING_PAYMENT",
  "PAYMENT_UNDER_REVIEW",
  "PAYMENT_CONFIRMED",
  "IN_PROGRESS",
  "READY_FOR_DELIVERY",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
] as const;
type Status = (typeof STATUSES)[number];

async function isAdmin(req: NextRequest) {
  const t = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return t?.role === "ADMIN";
}
const deny = () => NextResponse.json({ error: "غير مصرح" }, { status: 401 });
const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return deny();
  const items = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      customer: { select: { name: true, phone: true, telegram: true } },
    },
  });
  return NextResponse.json(items);
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) return deny();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return bad("id مطلوب");
  const b = await req.json();

  const current = await prisma.order.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!current) return bad("الطلب غير موجود");

  const data: { status?: Status; price?: number } = {};
  if (typeof b.status === "string" && (STATUSES as readonly string[]).includes(b.status)) {
    data.status = b.status as Status;
  }
  if (b.price !== undefined && b.price !== "") {
    const p = Number(b.price);
    if (Number.isNaN(p) || p < 0) return bad("السعر غير صحيح");
    data.price = p;
  }

  const order = await prisma.order.update({ where: { id }, data });
  if (data.status && data.status !== current.status) {
    await prisma.orderStatusEvent.create({
      data: { orderId: id, status: data.status },
    });
  }
  return NextResponse.json(order);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return deny();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return bad("id مطلوب");
  await prisma.$transaction([
    prisma.orderStatusEvent.deleteMany({ where: { orderId: id } }),
    prisma.order.delete({ where: { id } }),
  ]);
  return NextResponse.json({ ok: true });
}
