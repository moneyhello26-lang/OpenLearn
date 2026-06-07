import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import LayoutClient from "./layout-client";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenLearn.kz — Знания без барьеров",
  description: "Бесплатные учебники и гайды для каждого казахстанца. ЦУР 4.",
  verification: {
    google: "8wptJgry1hhNbKBEYxxwv1wrAXJ-hvwtAJBuzJh1AAk",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ background: 'var(--bg)' }}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
