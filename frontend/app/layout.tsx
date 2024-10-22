import './global.scss'
import 'reactjs-popup/dist/index.css';
import React from "react";
import {auth} from "@/auth";
import {SessionProvider} from "next-auth/react";
import classnames from "classnames";
import {Inter} from "next/font/google";
import PageLoadingProgressbar from "@/libs/@dexodus/admin-constructor/src/PageLoadingProgressbar";

const font = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ['latin', 'cyrillic'],
});

export const metadata = {
  title: "Exchange Rates",
  description: "Админ панель для Exchange Rates",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body style={{background: 'url(images/background.svg)'}} className={classnames(font.className)}>
          <PageLoadingProgressbar/>
          {children}
        </body>
      </SessionProvider>
    </html>
  )
}
