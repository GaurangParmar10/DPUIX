import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Magnifier } from "@/components/accessibility/Magnifier";

export const metadata: Metadata = {
  title: "DigitalBridge — Technology Made Understandable",
  description:
    "A calm, accessible digital platform helping parents, older adults, and digitally inexperienced users understand confusing screens, check security safety, and follow step-by-step guidance.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DigitalBridge",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F1C2E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-text-scale="normal">
      <body className="bg-navy-900 text-slateText-primary min-h-screen flex flex-col antialiased selection:bg-goldAccent/30 selection:text-goldAccent overflow-x-hidden">
        <AccessibilityProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-28 lg:pb-12">
            {children}
          </main>
          <MobileNav />
          <Magnifier />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
