import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ToastProvider, QueryProvider } from "@/providers";
import { RoleProvider } from "@/contexts";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Concert Tickets",
  description: "Full-stack developer assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <QueryProvider>
          <RoleProvider>{children}</RoleProvider>
        </QueryProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
