
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
      <div className="flex flex-col min-h-screen bg-background">
        <TopNavigation isPublic />
        
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
