import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Diraa & Pupaa — Our Little Universe ♡",
  description:
    "A little world, made just for us. A romantic anniversary gift for Diraa from Pupaa.",
  keywords: ["anniversary", "love", "romantic", "Diraa", "Pupaa", "our little universe"],
  authors: [{ name: "Pupaa" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Diraa & Pupaa — Our Little Universe ♡",
    description: "A little world, made just for us.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${dmSans.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
