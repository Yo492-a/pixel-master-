import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PIXEL Master — استوديو تصميم ومونتاج احترافي",
  description:
    "PIXEL Master: تصميم صور، مونتاج فيديو، موشن غرافيك، مؤثرات بصرية، وكوليرغريدنغ. Designing Visions, Creating Stories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body bg-void text-ink antialiased">{children}</body>
    </html>
  );
}
