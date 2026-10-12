import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^\+?[0-9]{8,15}$/),
  telegram: z.string().trim().max(64).optional(),
  notes: z.string().trim().min(10).max(2000),
  website: z.string().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "تأكد من الاسم ورقم الهاتف ووصف الطلب (10 أحرف على الأقل)" },
      { status: 400 }
    );
  }
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true, orderNumber: 0 });

  try {
    let user = await prisma.user.findUnique({ where: { phone: d.phone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: d.name,
          phone: d.phone,
          telegram: d.telegram || null,
          role: "CUSTOMER",
          passwordHash: await bcrypt.hash(randomBytes(24).toString("hex"), 10),
        },
      });
    }

    const recent = await prisma.order.count({
      where: {
        customerId: user.id,
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
    });
    if (recent >= 5) {
      return NextResponse.json(
        { error: "وصلت للحد الأقصى من الطلبات بالساعة، جرّب لاحقاً" },
        { status: 429 }
      );
    }

    for (let attempt = 0; attempt < 3; attempt++) {
      const last = await prisma.order.findFirst({
        orderBy: { orderNumber: "desc" },
        select: { orderNumber: true },
      });
      const orderNumber = (last?.orderNumber ?? 1000) + 1;
      try {
        const order = await prisma.order.create({
          data: {
            orderNumber,
            customerId: user.id,
            price: 0,
            notes: d.notes,
            status: "AWAITING_PAYMENT",
            statusHistory: {
              create: { status: "AWAITING_PAYMENT", note: "تم استلام الطلب" },
            },
          },
        });
        return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
      } catch (e) {
        if (attempt === 2) throw e;
      }
    }
    return NextResponse.json({ error: "تعذّر حفظ الطلب" }, { status: 500 });
  } catch (e) {
    console.error("order error", e);
    return NextResponse.json(
      { error: "صار خطأ بحفظ الطلب، جرّب مرة تانية" },
      { status: 500 }
    );
  }
}
