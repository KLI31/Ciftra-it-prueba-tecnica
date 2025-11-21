import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Exo_2 } from "next/font/google";
import { Toaster } from "sonner";
import { ViewTransition } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const exo2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cifra.it",
  description: "Gestion de solicitudes CRIFA-IT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${exo2.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Toaster position="top-right" richColors />
        <ViewTransition>{children}</ViewTransition>
      </body>
    </html>
  );
}
