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
          <main className="flex min-h-screen bg-background">
            <div className="flex-1 flex items-center justify-center">
              {children}
            </div>
          </main>
        </ThemeWrapper>
      </StackTheme>
    </StackProvider>
  );
}