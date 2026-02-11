import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Currents — Editorial Prediction Markets",
  description: "Currents brings editorial credibility to prediction markets. Explore community forecasts on politics, technology, economics, and global events.",
  keywords: ["prediction markets", "forecasting", "politics", "technology", "economics", "futures", "editorial"],
  authors: [{ name: "Currents" }],
  openGraph: {
    title: "Currents — Editorial Prediction Markets",
    description: "Explore community forecasts on politics, technology, and global events with editorial credibility.",
    type: "website",
  },
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
        {children}
      </body>
    </html>
  );
}
