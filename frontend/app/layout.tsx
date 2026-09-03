import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react"
import Script from "next/script";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import "./globals.css";
import React from "react";

const regularRoboto = localFont({
  src: "./fonts/Roboto-Regular.woff",
  variable: "--font-regular-roboto",
  weight: "100 900",
});

const themeScript = `(() => { try { const savedTheme = localStorage.getItem("ismi-theme"); const theme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; document.documentElement.dataset.theme = theme; } catch {} })();`;

export const metadata: Metadata = {
  title: "ISMI",
  description: "Система мониторинга информационного поля",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{themeScript}</Script>
      </head>
      <body
        className={`${regularRoboto.variable} antialiased`}
      >
      <ThemeProvider>
        <SessionProvider>
          {children}
        </SessionProvider>
        <ThemeToggle/>
      </ThemeProvider>
      </body>
    </html>
  );
}
