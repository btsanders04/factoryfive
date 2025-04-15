import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../../stack";
import { ThemeWrapper } from "@/components/theme-wrapper";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>
        <ThemeWrapper>
          {/* Auth pages layout without sidebar */}
          <main className="flex min-h-screen w-full h-screen items-center justify-center bg-background">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full">
                {children}
              </div>
            </div>
          </main>
        </ThemeWrapper>
      </StackTheme>
    </StackProvider>
  );
}