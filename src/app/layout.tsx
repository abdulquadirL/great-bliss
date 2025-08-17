import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GreatBliss SkincareNG - Premium Skincare Products",
  description: "Discover premium skincare products from GreatBliss SkincareNG. Shop our collection of serums, moisturizers, cleansers, and more. Elevate your beauty routine with Nigerian skincare excellence.",
  keywords: [
    "skincare", "beauty", "serum", "moisturizer", "cleanser", "Nigerian skincare", "premium beauty products", "face cream", "anti-aging", "glow", "GreatBliss SkincareNG"
  ],
  authors: [{ name: "GreatBliss SkincareNG" }],
  // openGraph: {
  //   title: "GreatBliss SkincareNG - Premium Skincare Products",
  //   description: "Discover premium skincare products from GreatBliss SkincareNG. Shop our collection of serums, moisturizers, cleansers, and more.",
  //   type: "website",
  //   url: "https://greatblissskincare.com",
    // images: [
    //   {
    //     url: "/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "GreatBliss SkincareNG - Premium Skincare Products",
    //   },
    // ],
  //},
  // twitter: {
  //   card: "summary_large_image",
  //   title: "GreatBliss SkincareNG - Premium Skincare Products",
  //   description: "Discover premium skincare products from GreatBliss SkincareNG.",
  //   images: ["/og-image.jpg"],
  //   site: "@greatblissskincare",
  // },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#f7fafc" />
        <meta name="author" content="GreatBliss SkincareNG" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}