'use client';

import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import ClientLayout from "../components/ClientLayout";
import { RoleProvider } from "../components/RoleContext";
import { NotificationsProvider } from "../context/NotificationsContext";

import "./globals.css";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
        <RoleProvider>
          <NotificationsProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </NotificationsProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
