import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const t = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (t?.role !== "ADMIN")
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const works = await prisma.work.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true, previewMedia: true },
    });
    return NextResponse.json({ count: works.length });
  } catch (e) {
    return NextResponse.json({
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
