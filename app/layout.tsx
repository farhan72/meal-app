import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className={`antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
