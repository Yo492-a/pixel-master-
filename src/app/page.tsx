import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { Hero } from "@/components/Hero";
import { ServicesGrid } from "@/components/ServicesGrid";
import { WorksPreview } from "@/components/WorksPreview";

export const revalidate = 0; // دائماً محتوى حي من قاعدة البيانات، لا Cache قديم

async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

async function getLatestWorks() {
  try {
    const works = await prisma.work.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { category: true, previewMedia: true },
    });
    return works.map((w) => ({
      id: w.id,
      title: w.title,
      previewUrl: w.previewMedia.url,
      categoryName: w.category.name,
      price: w.price ? `$${w.price.toString()}` : null,
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [settings, services, works] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getLatestWorks(),
  ]);

  return (
    <main>
      <Hero
        siteName={settings.site_name}
        tagline={settings.hero_tagline}
        subtitle={settings.hero_subtitle}
        ctaPrimary={settings.hero_cta_primary}
        ctaSecondary={settings.hero_cta_secondary}
      />
      <ServicesGrid title={settings.services_title} services={services} />
      <WorksPreview title={settings.works_title} works={works} />
    </main>
  );
}
