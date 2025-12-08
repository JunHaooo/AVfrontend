// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Latest News",
  description: "Your dashboard for the latest news.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* --- Modern Centered Menu Bar --- */}
        <header className="w-full bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center">
            <div className="flex space-x-8">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition font-medium text-lg"
              >
                Home
              </Link>
              <Link
                href="/upload"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition font-medium text-lg"
              >
                Upload
              </Link>
              <Link
                href="/chat"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition font-medium text-lg"
              >
                Chat
              </Link>
            </div>
          </nav>
        </header>

        {/* --- Main Content --- */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
