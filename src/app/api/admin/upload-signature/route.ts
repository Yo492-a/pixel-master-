import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const t = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (t?.role !== "ADMIN")
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret)
    return NextResponse.json({ error: "إعدادات Cloudinary ناقصة" }, { status: 500 });

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "pixel-master";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
}
