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
  title: "QuoteSnap — Professional quotes & proposals in 60 seconds",
  description:
    "Create client-ready quote and proposal PDFs free. No signup. Built for freelancers and small service businesses who need to look legit and close deals faster.",
  keywords: [
    "quote generator",
    "proposal template",
    "freelance quote",
    "PDF proposal",
    "free estimate generator",
  ],
  openGraph: {
    title: "QuoteSnap — Professional quotes in 60 seconds",
    description:
      "Free quote & proposal PDF generator. No account. Pro unlocks branding.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
