"use client";

// components/sidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_ROUTES, PUBLIC_ROUTES } from "@/app/routes";
import { UserButton, useUser } from "@stackframe/stack";
import InstallPrompt from "./InstallPrompt";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onNavigate?: () => void;
  routes?: Array<{ link: string; name: string; icon: React.ReactNode }>;
  isAuthenticated?: boolean;
}

export function Sidebar({ onNavigate, routes, isAuthenticated }: SidebarProps) {
  const pathname = usePathname();
  return (
    <div className="h-full flex flex-col py-6 px-4 overflow-hidden">
      <div className="mb-8">
        <h2 className="text-lg font-semibold px-4">Menu</h2>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto">
        {(isAuthenticated ? Object.values(MAIN_ROUTES) : Object.values(PUBLIC_ROUTES)).map((route, index) => {
          return (
            <NavItem
              key={index}
              href={route.link}
              icon={route.icon}
              label={route.name}
              active={!!pathname && pathname.includes(route.link)}
              onClick={onNavigate}
            />
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t">
        {isAuthenticated && <UserButton />}
        {!isAuthenticated && (
            <Link href="/handler/sign-in">
              <Button variant="secondary" size="sm">
                Sign In
              </Button>
            </Link>
        )}
        <InstallPrompt />
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  variant?: "default" | "ghost";
  onClick?: () => void;
}

function NavItem({
  href,
  icon,
  label,
  active = false,
  variant = "default",
  onClick,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
        ${
          active
            ? "bg-accent text-accent-foreground"
            : variant === "ghost"
              ? "text-muted-foreground hover:text-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

