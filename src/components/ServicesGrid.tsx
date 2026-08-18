type ServiceItem = {
  id: string;
  title: string;
  description: string;
};

export function ServicesGrid({
  title,
  services,
}: {
  title: string;
  services: ServiceItem[];
}) {
  if (services.length === 0) return null;

  return (
    <section className="px-6 py-14">
      <h2 className="mb-8 text-center font-display text-2xl font-600 text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="group rounded-2xl border border-line bg-surface p-5 transition hover:border-neon/50 hover:shadow-glowSm"
          >
            <h3 className="font-display text-sm font-600 text-ink sm:text-base">
              {service.title}
            </h3>
            <p className="mt-1.5 text-xs text-silver sm:text-sm">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
