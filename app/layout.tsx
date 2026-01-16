import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* =======================================================================
 * GOODBYE CTRL+ALT+DAD - January 2026
 * -----------------------------------------------------------------------
 * The name that started it all. What began as a playful dad-joke brand
 * has evolved into something bigger. Thanks for the memories and the
 * laughs, Ctrl+Alt+Dad. You were weird, wonderful, and uniquely ours.
 * 
 * Now we become Bespoke - crafted experiences for discerning travelers.
 * But we'll never forget where we came from.
 * 
 * "Ctrl+Alt+Dad Trips" - 2024-2026 - Gone but not forgotten
 * ======================================================================= */
export const metadata: Metadata = {
  title: "Ctrl+Alt+Dad Trips",
  description: "AI-powered travel planning personalized to your style",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar session={session} />
        {children}
      </body>
    </html>
  );
}
