import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: {
    default: "MealApp – Explore Meals & Ingredients",
    template: "%s | MealApp",
  },
  description: "Browse hundreds of ingredients, discover tasty meals, and get step-by-step cooking instructions. Powered by TheMealDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`antialiased font-sans`}>
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
