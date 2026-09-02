import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react"
import "./globals.css";
import React from "react";

const regularRoboto = localFont({
  src: "./fonts/Roboto-Regular.woff",
  variable: "--font-regular-roboto",
  weight: "100 900",
});

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
    <html lang="ru">
      <body
        className={`${regularRoboto.variable} antialiased`}
      >
      <SessionProvider>
        {children}
      </SessionProvider>
      </body>
    </html>
  );
}
