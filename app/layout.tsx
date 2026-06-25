import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "科富商會 | TechWealth Elite",
  description: "The ultimate hub for high-net-worth business leaders",
  openGraph: {
    title: "科富商會 | TechWealth Elite",
    description: "The ultimate hub for high-net-worth business leaders",
    images: [
      {
        url: "/logo.jpg",
        width: 400,
        height: 400,
        alt: "科富商會 Logo"
      }
    ],
    type: "website",
    siteName: "科富商會"
  },
  twitter: {
    card: "summary_large_image",
    title: "科富商會 | TechWealth Elite",
    description: "The ultimate hub for high-net-worth business leaders",
    images: ["/logo.jpg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
        {children}
      </body>
    </html>
  );
}
