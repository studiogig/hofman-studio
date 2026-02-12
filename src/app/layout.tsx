import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const calibre = localFont({
  src: "../fonts/CalibreMedium.otf",
  variable: "--font-calibre",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hofman.studio"),
  title: "Hofman Studio — Material Intelligence",
  description:
    "Hofman Studio is an AI-native production practice for luxury brands. Specialising in material intelligence — merging generative AI with high-end visual production for fashion, beauty, and luxury.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hofman Studio — Material Intelligence",
    description:
      "AI-native production practice for luxury brands. Material intelligence — merging generative AI with high-end visual production.",
    url: "https://www.hofman.studio",
    siteName: "Hofman Studio",
    type: "website",
    locale: "en_GB",
    images: [{ url: "/og-image/HOFMAN_OG.png", width: 1200, height: 630, alt: "Hofman Studio — Material Intelligence for Luxury Production" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hofman Studio — Material Intelligence",
    description:
      "AI-native production practice for luxury brands. Material intelligence — merging generative AI with high-end visual production.",
    images: ["/og-image/HOFMAN_OG.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={calibre.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Hofman Studio",
              url: "https://www.hofman.studio",
              description:
                "AI-native production practice for luxury brands. Material intelligence — merging generative AI with high-end visual production.",
              founder: {
                "@type": "Person",
                name: "Sam Hofman",
              },
              knowsAbout: [
                "AI-generated imagery",
                "Luxury brand production",
                "Generative AI",
                "Visual production",
                "Creative direction",
              ],
              logo: "https://www.hofman.studio/og-image/HOFMAN_OG.png",
              image: "https://www.hofman.studio/og-image/HOFMAN_OG.png",
              // TODO: Add social links when ready
              // sameAs: ["https://instagram.com/...", "https://linkedin.com/in/..."],
            }),
          }}
        />
      </head>
      <body className="antialiased bg-white text-black font-sans min-h-screen">
        <main className="w-full pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
