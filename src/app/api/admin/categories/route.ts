import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

async function isAdmin(req: NextRequest) {
  const t = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return t?.role === "ADMIN";
}

const deny = () => NextResponse.json({ error: "غير مصرح" }, { status: 401 });

const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[\/\\?#%&]/g, "") || "cat";

async function uniqueSlug(name: string, ignoreId?: string) {
  const base = slugify(name);
  let slug = base;
  let i = 1;
  while (true) {
    const found = await prisma.category.findUnique({ where: { slug } });
    if (!found || found.id === ignoreId) return slug;
    slug = `${base}-${++i}`;
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return deny();
  const items = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { works: true } } },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return deny();
  const { name } = await req.json();
  if (!name?.trim())
    return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  const last = await prisma.category.findFirst({ orderBy: { order: "desc" } });
  const item = await prisma.category.create({
    data: {
      name: name.trim(),
      slug: await uniqueSlug(name),
      order: (last?.order ?? 0) + 1,
    },
  });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) return deny();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });
  const { name, order } = await req.json();
  const data: { name?: string; slug?: string; order?: number } = {};
  if (typeof name === "string" && name.trim()) {
    data.name = name.trim();
    data.slug = await uniqueSlug(name, id);
  }
  if (typeof order === "number") data.order = order;
  const item = await prisma.category.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return deny();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });
  const count = await prisma.work.count({ where: { categoryId: id } });
  if (count > 0)
    return NextResponse.json(
      { error: `فيه ${count} أعمال بهالتصنيف، انقلها أو احذفها أول` },
      { status: 400 }
    );
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
