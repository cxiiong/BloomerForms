"use client";

import "./globals.css";
import AuthContext from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="W8PZgrE7Q2BakSqgrV4BzIPCsdd70VAnNhFYXV4kHZA"
        />
        <link rel="icon" href="/flower.png" />
        <title>BloomerForms</title>
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
          <AuthContext>
            {children}
            <Toaster />
          </AuthContext>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
