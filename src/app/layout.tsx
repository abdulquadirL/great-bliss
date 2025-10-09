import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GreatBliss SkincareNG - Premium Skincare Products",
  description: "Discover premium skincare products from GreatBliss SkincareNG. Shop our collection of serums, moisturizers, cleansers and more.",
  keywords: "skincare, beauty, serum, moisturizer, cleanser, Nigerian skincare, Abuja Skincare, premium beauty products",
  authors: [{ name: "GreatBliss SkincareNG" }],
  openGraph: {
    title: "GreatBliss SkincareNG - Premium Skincare Products",
    description: "Discover premium skincare products from GreatBliss SkincareNG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}