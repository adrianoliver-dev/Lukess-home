import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FooterNewsletter } from "@/components/marketing/FooterNewsletter";
import { CartProvider } from "@/lib/context/CartContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Analytics } from '@vercel/analytics/react'
import { HashScrollHandler } from "@/components/layout/HashScrollHandler";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#21808D",
};

export const metadata: Metadata = {
  title: {
    template: "%s | Lukess Home",
    default: "Lukess Home - Ropa Masculina en Santa Cruz | Mercado Mutualista",
  },
  description:
    "Más de 10 años vistiendo a bolivianos con estilo. 3 puestos en el Mercado Mutualista. Camisas, pantalones, chaquetas y más. Calidad y precio justo.",
  keywords: [
    "ropa masculina santa cruz",
    "tienda hombre mercado mutualista",
    "camisas santa cruz",
    "pantalones hombre bolivia",
    "ropa masculina",
    "tienda de ropa",
    "Santa Cruz",
    "Bolivia",
    "Mercado Mutualista",
    "chaquetas",
    "gorras",
    "moda hombre",
    "Lukess Home",
  ],
  authors: [{ name: "Lukess Home" }],
  creator: "Lukess Home",
  publisher: "Lukess Home",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lukess-home.vercel.app"),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://lukess-home.vercel.app",
    languages: {
      "es-BO": process.env.NEXT_PUBLIC_SITE_URL || "https://lukess-home.vercel.app",
      "x-default": process.env.NEXT_PUBLIC_SITE_URL || "https://lukess-home.vercel.app",
    },
  },
  openGraph: {
    title: "Lukess Home - Ropa Masculina en Santa Cruz | Mercado Mutualista",
    description:
      "Más de 10 años vistiendo a bolivianos con estilo. 3 puestos en el Mercado Mutualista. Camisas, pantalones, chaquetas y más.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://lukess-home.vercel.app",
    siteName: "Lukess Home",
    locale: "es_BO",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lukess Home - Ropa Masculina en Santa Cruz, Bolivia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lukess Home - Ropa Masculina en Santa Cruz",
    description:
      "3 puestos en el Mercado Mutualista. Camisas, pantalones, chaquetas y más. Calidad y precio justo.",
    images: ["/og-image.png"],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="font-sans">
        <HashScrollHandler />
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <a
                href="#inicio"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-gray-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
              >
                Saltar al contenido principal
              </a>
              <Navbar />
              <main role="main">{children}</main>
              <FooterNewsletter />
              <Footer />
              <Toaster
                position="bottom-right"
                containerStyle={{ bottom: 80 }}
                toastOptions={{
                  duration: 1500,
                }}
              />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        <Analytics />
        {process.env.NEXT_PUBLIC_CLARITY_ID && <MicrosoftClarity />}
      </body>
    </html>
  );
}
