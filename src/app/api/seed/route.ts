import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const adminPhone = process.env.SEED_ADMIN_PHONE ?? "0900000000";
    const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await prisma.user.upsert({
      where: { phone: adminPhone },
      update: {},
      create: {
        name: "PIXEL Master Admin",
        phone: adminPhone,
        passwordHash,
        role: "ADMIN",
      },
    });

    const categories = [
      { name: "صور", slug: "photo" },
      { name: "فيديو", slug: "video" },
      { name: "إعلانات", slug: "ads" },
      { name: "سوشيال ميديا", slug: "social" },
      { name: "موشن", slug: "motion" },
      { name: "شعارات", slug: "logos" },
      { name: "بنرات", slug: "banners" },
      { name: "أخرى", slug: "other" },
    ];
    for (const [i, c] of categories.entries()) {
      await prisma.category.upsert({
        where: { slug: c.slug },
        update: {},
        create: { ...c, order: i },
      });
    }

    await prisma.paymentMethod.upsert({
      where: { id: "seed-sham-cash" },
      update: {},
      create: {
        id: "seed-sham-cash",
        name: "SHAM CASH",
        accountNumber: "غيّر هذا من لوحة الإدارة",
        instructions: "حوّل المبلغ وارفع صورة إثبات الدفع.",
        order: 0,
      },
    });

    await prisma.paymentMethod.upsert({
      where: { id: "seed-syriatel-cash" },
      update: {},
      create: {
        id: "seed-syriatel-cash",
        name: "SYRIATEL CASH",
        accountNumber: "غيّر هذا من لوحة الإدارة",
        instructions: "حوّل المبلغ وارفع صورة إثبات الدفع.",
        order: 1,
      },
    });

    return NextResponse.json({ message: "✅ Seed complete" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Seed failed" },
      { status: 500 }
    );
  }
}
