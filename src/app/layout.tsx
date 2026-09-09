import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cut Tracker",
  description: "Votre suivi quotidien de perte de poids",
  applicationName: "Cut Tracker",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Cut Tracker" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f5f7f4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}<ServiceWorkerRegistration /></body>
    </html>
  );
}
