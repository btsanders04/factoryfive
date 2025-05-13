
import { ThemeWrapper } from "@/components/theme-wrapper";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/sidebar";
import { MobileNavigation } from "@/components/mobile-navigation";
import { stackServerApp } from "@/stack";
import { StackProvider, StackTheme } from "@stackframe/stack";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>
    <ThemeWrapper>
      <div className="flex min-h-screen bg-background">
        {/* Desktop left sidebar - hidden on mobile */}
        <div className="hidden md:block w-64 border-r">
          <Sidebar isPublic />
        </div>
        
        {/* Mobile navigation - visible only on mobile */}
        <div className="md:hidden">
          <MobileNavigation isPublic />
        </div>
        
        <main className="flex-1">
          <div className="container mx-auto py-4 px-4 md:px-8">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </ThemeWrapper>
    </StackTheme>
    </StackProvider>
  );
}
