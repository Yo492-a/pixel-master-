import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { works: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const body = await req.json();
  const { name, slug } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "الاسم والرابط مطلوبان" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: { name, slug },
  });

  return NextResponse.json(category);
}
