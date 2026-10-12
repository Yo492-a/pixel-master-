import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

async function getWorks() {
  try {
    const works = await prisma.work.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: { category: true, previewMedia: true },
    });
    return works.map((w) => ({
      id: w.id,
      title: w.title,
      kind: w.kind,
      previewUrl: w.previewMedia.url,
      categoryName: w.category.name,
      price: w.price ? `$${w.price.toString()}` : null,
    }));
  } catch {
    return [];
  }
}

export default async function WorksPage() {
  const works = await getWorks();

  return (
    <main className="px-6 py-14">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <h1 className="font-display text-2xl font-600 text-ink sm:text-3xl">
          أعمالنا
        </h1>
        <Link href="/" className="text-sm text-neon hover:underline">
          الرئيسية ←
        </Link>
      </div>

      {works.length === 0 ? (
        <p className="mx-auto mt-8 max-w-5xl text-center text-sm text-silver">
          لم تُنشر أعمال بعد.
        </p>
      ) : (
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {works.map((work) => (
            <Link
              key={work.id}
              href={`/works/${work.id}`}
              className="group relative overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <div className="relative aspect-[4/5] w-full">
                {work.kind === "VIDEO" ? (
                  <video
                    src={work.previewUrl}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={work.previewUrl}
                    alt={work.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-neon">
                  {work.categoryName}
                </p>
                <h3 className="mt-0.5 text-sm font-semibold text-ink">
                  {work.title}
                </h3>
                {work.price && (
                  <p className="mt-0.5 text-xs text-silver">{work.price}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
