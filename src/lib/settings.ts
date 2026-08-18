import { prisma } from "@/lib/prisma";

// كل نص أو صورة في الصفحة الرئيسية قابل للتعديل من Admin → الصفحة الرئيسية.
// هذه القيم الافتراضية تُستخدم فقط قبل أن يُنشئ المدير الإعدادات لأول مرة.
export const SETTINGS_DEFAULTS: Record<string, string> = {
  site_name: "PIXEL Master",
  hero_tagline: "PHOTO • VIDEO • DESIGN",
  hero_subtitle: "نحوّل أفكارك إلى صور وفيديوهات تُروى.",
  hero_cta_primary: "شاهد أعمالي",
  hero_cta_secondary: "اطلب تصميمك",
  services_title: "خدماتنا",
  works_title: "أحدث أعمالنا",
};

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map = { ...SETTINGS_DEFAULTS };
    for (const row of rows) map[row.key] = row.value;
    return map;
  } catch {
    // في حال عدم توفر قاعدة بيانات متصلة بعد (وضع المعاينة)
    return SETTINGS_DEFAULTS;
  }
}
