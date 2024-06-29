import "./globals.css";
import { Inter as FontSans } from "next/font/google"


import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
export const metadata = {
  title: "IPC to BNS",
  description: "Get Corresponding BNS Section for IPC Section",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
        className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
        )}
    >{children}</body>
    </html>
  );
}
