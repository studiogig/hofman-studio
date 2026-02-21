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
    <html lang="en-GB" className={calibre.variable}>
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
                "AI-native production practice for luxury brands. Material intelligence — merging generative AI with high-end visual production for fashion, beauty, and luxury.",
              founder: {
                "@type": "Person",
                name: "Sam Hofman",
                jobTitle: "Creative Director",
                url: "https://www.samhofman.com",
              },
              knowsAbout: [
                "AI-generated imagery",
                "AI product photography",
                "Luxury brand production",
                "Generative AI",
                "Visual production",
                "Creative direction",
                "Beauty photography",
                "Fragrance photography",
                "Spirits photography",
                "Material intelligence",
              ],
              logo: "https://www.hofman.studio/og-image/HOFMAN_OG.png",
              image: "https://www.hofman.studio/og-image/HOFMAN_OG.png",
              sameAs: [
                "https://www.instagram.com/hofman.studio",
                "https://linkedin.com/in/samhofman",
                "https://medium.com/@samhofman",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "London",
                addressCountry: "GB",
              },
              areaServed: "Worldwide",
              priceRange: "$$$$",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              name: "Hofman Studio Portfolio",
              description: "AI-generated luxury product photography and motion for brands including Gucci Beauty, Merit Beauty, and fine watchmaking.",
              url: "https://www.hofman.studio",
              creator: {
                "@type": "Person",
                name: "Sam Hofman",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased bg-white text-black font-sans min-h-screen">
        <h1 className="sr-only">Hofman Studio — AI Product Photography and Motion for Luxury Brands</h1>
        <main className="w-full pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
