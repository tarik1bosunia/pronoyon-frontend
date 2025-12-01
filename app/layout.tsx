import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { GoogleAuthProvider } from "@/components/auth/providers/GoogleAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pronoyon - Question Bank",
  description: "Professional Question Bank Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <GoogleAuthProvider>
            {children}
            <Toaster richColors position="top-center" />
          </GoogleAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
