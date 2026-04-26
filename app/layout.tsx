import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InTIMIdated by Math",
  description: "GRE Quant prep for people scared of math",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full" style={{ background: "#FAFAF8", color: "#1A1714" }}>
        {children}
      </body>
    </html>
  );
}
