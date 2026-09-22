import { prisma } from "@/lib/prisma";

export default async function WhatsAppButton() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "whatsapp_number" },
  });

  if (!setting?.value) return null;

  return (
    <a
      href={`https://wa.me/${setting.value}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition hover:scale-110"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.258.6 4.373 1.646 6.2L3.2 28.8l6.77-1.61A12.73 12.73 0 0 0 16.001 28.8c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.8-12.8Zm7.44 18.02c-.31.87-1.53 1.6-2.51 1.81-.67.14-1.54.25-4.48-.96-3.76-1.56-6.19-5.38-6.38-5.63-.19-.25-1.53-2.03-1.53-3.87 0-1.84.96-2.74 1.3-3.11.31-.34.68-.42.91-.42.23 0 .46.002.66.011.21.01.5-.08.78.59.31.75 1.05 2.59 1.14 2.78.09.19.15.41.03.66-.12.25-.18.4-.36.62-.18.22-.38.49-.54.66-.18.19-.37.4-.16.77.21.37.93 1.53 1.99 2.48 1.37 1.22 2.52 1.6 2.89 1.78.37.18.59.15.81-.09.22-.24.94-1.09 1.19-1.47.25-.37.5-.31.84-.19.34.12 2.15 1.01 2.52 1.2.37.19.61.28.7.44.09.16.09.93-.22 1.8Z" />
      </svg>
    </a>
  );
    }
