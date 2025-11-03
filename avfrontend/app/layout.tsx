import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalChatButton } from "@/components/ui/ConditionalChatButton";

//
// --- 1. FONT DEFINITIONS GO HERE ---
// (At the top level, NOT inside the component)
//
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//
// --- 2. METADATA GOES HERE ---
//
export const metadata: Metadata = {
  title: "Latest News",
  description: "Your dashboard for the latest news.",
};

//
// --- 3. THE LAYOUT COMPONENT GOES LAST ---
//
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <ConditionalChatButton />
      </body>
    </html>
  );
}