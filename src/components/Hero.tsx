import Link from "next/link";

export function Hero({
  siteName,
  tagline,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: {
  siteName: string;
  tagline: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center sm:pt-32">
      {/* توهج خلفي هادئ خلف الاسم — العنصر التوقيعي */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="aperture-ring h-[320px] w-[320px] animate-pulseGlow sm:h-[460px] sm:w-[460px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="font-mono text-xs tracking-[0.35em] text-neon">
          {tagline}
        </p>
        <h1 className="mt-4 font-display text-5xl font-700 leading-tight text-ink text-glow sm:text-7xl">
          {siteName}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-silver sm:text-lg">
          {subtitle}
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/works"
            className="rounded-full bg-electric px-7 py-3 text-sm font-semibold text-ink shadow-glow transition hover:brightness-110"
          >
            {ctaPrimary}
          </Link>
          <Link
            href="/order"
            className="rounded-full border border-line px-7 py-3 text-sm font-semibold text-ink transition hover:border-neon hover:text-neon"
          >
            {ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
