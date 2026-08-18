import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOFO ChangeHub | PJSOFONIC Enterprise Change Lifecycle",
  description: "Enterprise SaaS Change-Request Lifecycle Management for the PJSOFONIC Software Ecosystem",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
