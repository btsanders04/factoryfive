'use client';

import React, { useEffect } from 'react';

/**
 * ThemeWrapper component that forces dark mode for the Factory Five theme
 */
export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force dark mode for Factory Five theme
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}

/**
 * Use this component in your layout.tsx file:
 * 
 * import { ThemeWrapper } from "@/components/theme-wrapper";
 * 
 * export default function RootLayout({ children }: {
 *   children: React.ReactNode;
 * }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <body>
 *         <ThemeWrapper>
 *           {children}
 *         </ThemeWrapper>
 *       </body>
 *     </html>
 *   );
 * }
 */