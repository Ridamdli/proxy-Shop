import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CartStoreInitializer } from "@/components/providers/cart-store-initializer";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopHub - Your Premier Shopping Destination",
  description:
    "Discover amazing products at unbeatable prices. Fast shipping, secure checkout, and excellent customer service.",
  keywords: "ecommerce, shopping, online store, products, deals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* Initialize the cart store */}
          <CartStoreInitializer />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <SonnerToaster position="top-right" />
          <HotToaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
