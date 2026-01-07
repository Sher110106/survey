import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Blinds Survey | Energy Specialist Evaluation",
  description: "Help us build the future of automated, sustainable window blinds. Rate innovative concepts for motorized blinds that intelligently adapt to temperature, light, and weather conditions.",
  keywords: ["smart blinds", "automated blinds", "sustainable", "energy efficiency", "survey"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
