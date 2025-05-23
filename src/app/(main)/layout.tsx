import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../../stack";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { TopNavigation } from "@/components/top-navigation";
import { PdfViewerProvider } from "@/components/PdfViewerContext";
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>
        <ThemeWrapper>
          <PdfViewerProvider>
            {/* Main content area */}
            <main>
              <div className="flex flex-col min-h-screen bg-background">
                <TopNavigation />
                <div className="flex-1">
                  <div className="container mx-auto px-4 py-8 max-w-6xl">
                    {children}
                  </div>
                </div>
              </div>
            </main>
            <Toaster />
          </PdfViewerProvider>
        </ThemeWrapper>
      </StackTheme>
    </StackProvider>
  );
}
