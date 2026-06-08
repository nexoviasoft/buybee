import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import AntiDevTools from "@/components/security/AntiDevTools";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { theme } from "@/theme/antd";
import { hindSiliguriFonts, baiJamjuree } from "@/app/fonts";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import FloatingContact from "@/components/FloatingContact";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Buybee - Your Ultimate Online Shopping Destination",
    template: "%s | Buybee",
  },
  description: "Welcome to Buybee! Shop the best quality products including exltex, cosmetics, gifts, electronics, and daily essentials at unbeatable prices.",
  keywords: [
    "Buybee",
    "buybee shop",
    "buybee online",
    "buy bee",
    "exltex",
    "cosmetics",
    "cusdttics",
    "gift",
    "product",
    "online shopping",
    "best deals",
    "buybee website",
    "e-commerce",
  ],
  authors: [{ name: "Buybee" }],
  creator: "Buybee",
  publisher: "Buybee",
  applicationName: "Buybee",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Buybee - Shop Quality Products Online",
    description: "Discover top-tier cosmetics, gifts, and exclusive exltex products at Buybee. Your number one destination for secure and fast online shopping.",
    url: "https://buybee.com",
    siteName: "Buybee",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buybee - Shop Quality Products Online",
    description: "Discover top-tier cosmetics, gifts, and exclusive exltex products at Buybee. Your number one destination for secure and fast online shopping.",
    creator: "@Buybee",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfigProvider theme={theme}>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
          />
        </head>
        <body className={`${hindSiliguriFonts.variable} ${baiJamjuree.variable} font-baiJamjuree antialiased bg-white text-black`}>
          <AntiDevTools />
          <AuthProvider>
            <Toaster />
            <CartProvider>
              <AntdRegistry>
                <Header />
                <FlashSaleBanner />
                <div className="min-h-screen">{children}</div>
                <Footer />
                <BottomNav />
                <FloatingContact />
              </AntdRegistry>
            </CartProvider>
          </AuthProvider>
        </body>
      </html>
    </ConfigProvider>
  );
}
