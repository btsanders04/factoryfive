import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../../stack";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { Sidebar } from "@/components/sidebar";
import { MobileNavigation } from "@/components/mobile-navigation";
import { PdfViewerProvider } from "@/components/PdfViewerContext";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = !!(await stackServerApp.getUser());
  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>
        <ThemeWrapper>
          <PdfViewerProvider>
            {/* Main content area */}
            <main>
              <div>
                <div className="flex min-h-screen bg-background">
                  {/* Desktop left sidebar - hidden on mobile */}
                  <div className="hidden md:block w-64 border-l">
                    <Sidebar isAuthenticated={isAuthenticated} />
                  </div>
                  {/* Mobile navigation - visible only on mobile */}
                  <div className="md:hidden">
                    <MobileNavigation isAuthenticated={isAuthenticated} />
                  </div>
    {children}
                </div>
              </div>
            </main>
          </PdfViewerProvider>
        </ThemeWrapper>
      </StackTheme>
    </StackProvider>
  );
}
