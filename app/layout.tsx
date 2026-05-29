import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareLink Academy",
  description: "Digital healthcare onboarding and training platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
