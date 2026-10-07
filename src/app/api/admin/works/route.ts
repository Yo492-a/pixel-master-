import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

async function isAdmin(req: NextRequest) {
  const t = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return t?.role === "ADMIN";
}

const deny = () => NextResponse.json({ error: "غير مصرح" }, { status: 401 });
const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return deny();
  const items = await prisma.work.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, previewMedia: true },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return deny();
  const b = await req.json();
  if (!b.title?.trim() || !b.categoryId || !b.url) return bad("بيانات ناقصة");

  const kind = b.kind === "VIDEO" ? "VIDEO" : "IMAGE";
  const status = b.status === "PUBLISHED" ? "PUBLISHED" : "HIDDEN";
  const price = b.price === "" || b.price == null ? null : Number(b.price);
  if (price !== null && Number.isNaN(price)) return bad("السعر غير صحيح");

  const media = await prisma.media.create({
    data: {
      type: kind,
      url: b.url,
      width: b.width ?? null,
      height: b.height ?? null,
      sizeBytes: b.sizeBytes ?? null,
      originalName: b.originalName ?? null,
    },
  });

  const work = await prisma.work.create({
    data: {
      title: b.title.trim(),
      description: b.description?.trim() ?? "",
      kind,
      status,
      categoryId: b.categoryId,
      previewMediaId: media.id,
      price,
    },
  });
  return NextResponse.json(work);
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) return deny();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return bad("id مطلوب");
  const b = await req.json();
  const data: { status?: "PUBLISHED" | "HIDDEN"; title?: string } = {};
  if (b.status === "PUBLISHED" || b.status === "HIDDEN") data.status = b.status;
  if (typeof b.title === "string" && b.title.trim()) data.title = b.title.trim();
  const work = await prisma.work.update({ where: { id }, data });
  return NextResponse.json(work);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return deny();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return bad("id مطلوب");
  const orders = await prisma.order.count({ where: { workId: id } });
  if (orders > 0) return bad(`عليه ${orders} طلبات، أخفيه بدل ما تحذفو`);
  await prisma.work.delete({ where: { id } });
  return NextResponse.json({ ok: true });
      }
