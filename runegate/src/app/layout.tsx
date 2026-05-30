import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RuneGate — Fantasy Cyber Portal",
  description: "Enter the magical cyber realm. Your private MMO-style portal to games, chat, search, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌀</text></svg>" />
      </head>
      <body className="bg-rune-bg min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
