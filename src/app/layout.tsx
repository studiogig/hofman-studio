import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const calibre = localFont({
  src: "../fonts/CalibreMedium.otf",
  variable: "--font-calibre",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hofman Studio — Material Intelligence",
  description: "Material Intelligence. AI-native production practice for luxury brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={calibre.variable}>
      <body className="antialiased bg-white text-black font-sans min-h-screen">
        <main className="w-full pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
