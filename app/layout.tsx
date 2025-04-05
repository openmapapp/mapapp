import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import { DataProvider } from "./components/layout/DataProvider";
import { SocketProvider } from "./components/socketProvider";
import Navbar from "./components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MapApp",
  description: "Community-based real-time mapping platform",
  applicationName: "MapApp",
  keywords: ["mapping", "community", "real-time", "open source"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1.5,
  userScalable: true,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden overscroll-none m-0 p-0`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SocketProvider>
            <DataProvider>
              <main className="flex flex-col min-h-screen max-w-full overflow-x-hidden">
                <Navbar />
                <div className="flex-1 w-full flex justify-center overflow-hidden">
                  {children}
                </div>
                <Toaster richColors position="top-center" closeButton />
              </main>
            </DataProvider>
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
