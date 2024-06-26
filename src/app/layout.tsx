"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}
import { QueryProvider } from "@/lib/config";

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   console.log(pathname)
  //   const allowedPaths = ['/login', '/signup'];
  //   const isTokenAvailable = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  //   if (!isTokenAvailable && !allowedPaths.includes(pathname)) {
  //     router.push('/login');
  //   }
  // });

  return (
    <html lang="en">
      <QueryProvider>
        <body>{children}</body>
      </QueryProvider>
    </html>
  );
};

export default RootLayout;
