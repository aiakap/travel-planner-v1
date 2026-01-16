import type { Metadata } from "next";
import { Playfair_Display, Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-adventure",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
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
  title: "Bespoke | Experiences Crafted for You",
  description: "Personalized travel experiences curated by experts and shaped by your community",
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
        className={`${playfair.variable} ${outfit.variable} ${inter.variable} antialiased`}
      >
        <Navbar session={session} />
        {children}
      </body>
    </html>
  );
}
