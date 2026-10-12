import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function WorkPage({
  params,
}: {
  params: { id: string };
}) {
  const work = await prisma.work
    .findFirst({
      where: { id: params.id, status: "PUBLISHED" },
      include: { category: true, previewMedia: true },
    })
    .catch(() => null);

  if (!work) notFound();

  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/works" className="text-sm text-neon hover:underline">
          ← كل الأعمال
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
          {work.kind === "VIDEO" ? (
            <video
              src={work.previewMedia.url}
              controls
              playsInline
              className="w-full"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={work.previewMedia.url}
              alt={work.title}
              className="w-full"
            />
          )}
        </div>

        <p className="mt-6 font-mono text-xs uppercase tracking-wider text-neon">
          {work.category.name}
        </p>
        <h1 className="mt-1 font-display text-2xl font-600 text-ink sm:text-3xl">
          {work.title}
        </h1>
        {work.price && (
          <p className="mt-2 text-silver">${work.price.toString()}</p>
        )}
        {work.description && (
          <p className="mt-4 whitespace-pre-line text-silver">
            {work.description}
          </p>
        )}
      </div>
    </main>
  );
}
