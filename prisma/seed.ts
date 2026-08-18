import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1) حساب المدير الأول — غيّر القيم في .env قبل التشغيل
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

  // 2) التصنيفات الأساسية
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

  // 3) طرق الدفع
  await prisma.paymentMethod.upsert({
    where: { id: "seed-sham-cash" },
    update: {},
    create: {
      id: "seed-sham-cash",
      name: "SHAM CASH",
      accountNumber: "غيّر هذا الرقم من لوحة الإدارة",
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
      accountNumber: "غيّر هذا الرقم من لوحة الإدارة",
      instructions: "حوّل المبلغ وارفع صورة إثبات الدفع.",
      order: 1,
    },
  });

  console.log("✅ Seed complete. Admin phone:", adminPhone);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
