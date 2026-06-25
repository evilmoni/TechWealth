import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "科富商會 | TechWealth Elite",
  description: "The ultimate hub for high-net-worth business leaders",
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
