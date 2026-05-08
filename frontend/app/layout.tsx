import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProvedorToast } from "@/app/contexts/ToastContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ERP DuJojo",
  description: "O melhor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProvedorToast>{children}</ProvedorToast>
      </body>
    </html>
  );
}
