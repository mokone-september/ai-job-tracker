import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Job Tracker",
  description: "Track your job applications with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          {children}
          <ThemeToggle />
        </Provider>
      </body>
    </html>
  );
}
