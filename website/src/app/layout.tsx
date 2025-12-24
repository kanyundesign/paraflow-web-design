import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paraflow - The Visual Coding Agent",
  description: "Vibe coding, with product definition and real engineering built in. The infinite canvas for building real software.",
  keywords: ["visual coding", "AI", "development", "design", "production ready"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}



