import type { Metadata, Viewport } from "next";
import "./globals.css";
import { UserProvider } from "@/lib/UserContext";
import PWAInstall from "@/components/ui/PWAInstall";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Mkutano — Village Savings Group Manager", template: "%s | Mkutano" },
  description: "Mkutano is an offline-first savings group management system for women's village savings and loan associations (VSLAs). Run better meetings, track contributions, and grow together.",
  keywords: ["savings group", "VSLA", "village savings", "women savings", "microfinance", "Kenya", "offline-first"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mkutano",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Mkutano — Village Savings Group Manager",
    description: "Run better savings meetings. Track every shilling. Grow together.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#10b981",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lexend:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/icons/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icons/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mkutano" />
      </head>
      <body>
        <UserProvider>
          <PWAInstall />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
