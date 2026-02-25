import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VELVET - Luxury Clothing | Premium Fashion & Sustainable Elegance",
  description: "Discover VELVET's curated collection of luxury clothing. Timeless pieces crafted with precision, sustainable materials, and artisan craftsmanship. Shop silk dresses, cashmere coats, and premium fashion.",
  keywords: [
    "luxury clothing",
    "premium fashion",
    "sustainable fashion",
    "designer clothes",
    "silk dresses",
    "cashmere coats",
    "artisan clothing",
    "ethical fashion",
    "high-end fashion",
    "VELVET clothing"
  ],
  authors: [{ name: "VELVET" }],
  creator: "VELVET",
  publisher: "VELVET",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://velvet-clothing.com",
    siteName: "VELVET",
    title: "VELVET - Luxury Clothing | Premium Fashion & Sustainable Elegance",
    description: "Discover VELVET's curated collection of luxury clothing. Timeless pieces crafted with precision and sustainable materials.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "VELVET Luxury Clothing Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VELVET - Luxury Clothing | Premium Fashion",
    description: "Discover VELVET's curated collection of luxury clothing. Timeless pieces crafted with precision.",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"],
    creator: "@velvetclothing",
  },
  alternates: {
    canonical: "https://velvet-clothing.com",
  },
  category: "Fashion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${cormorant.variable} ${montserrat.variable} font-sans antialiased`}>
        {children}

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              "name": "VELVET",
              "description": "Luxury clothing brand offering premium fashion and sustainable elegance",
              "url": "https://velvet-clothing.com",
              "logo": "https://velvet-clothing.com/logo.png",
              "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
              "priceRange": "$$$",
              "servesCuisine": "Luxury Fashion",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              },
              "sameAs": [
                "https://instagram.com/velvetclothing",
                "https://pinterest.com/velvetclothing",
                "https://twitter.com/velvetclothing"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "VELVET Collection",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Silk Evening Dress",
                      "category": "Dresses"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Cashmere Coat",
                      "category": "Outerwear"
                    }
                  }
                ]
              }
            }),
          }}
        />
      </body>
    </html>
  );
}
