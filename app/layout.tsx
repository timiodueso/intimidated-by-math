import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import SideNav from "./components/SideNav";

const geist = Geist({
  variable: "--font-geist-sans",
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
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
        <SideNav />
        {/* md: offset left by sidebar width; mobile: offset bottom by nav height */}
        <main className="pb-16 md:pb-0 md:ml-56 min-h-dvh">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
