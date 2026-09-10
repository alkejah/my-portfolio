import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { siteConfig } from "@/config/site";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,

    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  keywords: [
    "Full-Stack Developer",
    "Web Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "Portfolio",
  ],

  authors: [
    {
      name: siteConfig.name,
    },
  ],

  creator: siteConfig.name,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",

    url: "/",

    siteName: siteConfig.name,

    title: siteConfig.title,

    description: siteConfig.description,
  },

  twitter: {
    card: "summary",

    title: siteConfig.title,

    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
