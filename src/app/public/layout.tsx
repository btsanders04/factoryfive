
import { ThemeWrapper } from "@/components/theme-wrapper";
import { Toaster } from "@/components/ui/toaster";
import { TopNavigation } from "@/components/top-navigation";
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
      <div className="app-shell flex min-h-screen flex-col bg-background">
        <TopNavigation isPublic />
        
        <main className="relative z-10 flex-1">
          <div className="container mx-auto px-4 py-4 md:px-8 md:py-6">
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
