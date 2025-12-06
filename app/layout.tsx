import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { GoogleAuthProvider } from "@/components/auth/providers/GoogleAuthProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
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
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <ReduxProvider>
          <GoogleAuthProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
            <Toaster richColors position="top-center" />
          </GoogleAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
