import Image from "next/image";
import Link from "next/link";

type WorkItem = {
  id: string;
  title: string;
  previewUrl: string;
  categoryName: string;
  price: string | null;
};

export function WorksPreview({
  title,
  works,
}: {
  title: string;
  works: WorkItem[];
}) {
  return (
    <section className="px-6 py-14">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <h2 className="font-display text-2xl font-600 text-ink sm:text-3xl">
          {title}
        </h2>
        <Link href="/works" className="text-sm text-neon hover:underline">
          عرض الكل ←
        </Link>
      </div>

      {works.length === 0 ? (
        <p className="mx-auto mt-8 max-w-5xl text-center text-sm text-silver">
          لم تُنشر أعمال بعد. أضِف أول عمل من لوحة الإدارة ليظهر هنا فوراً.
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
                <Image
                  src={work.previewUrl}
                  alt={work.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
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
    </section>
  );
}
