/* eslint-disable jsx-a11y/alt-text */
"use client";

// components/sidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  User,
  HelpCircle,
  CreditCard,
  Image,
  DollarSign,
} from "lucide-react";
import { ROUTES } from "@/app/routes";
import { UserButton } from "@stackframe/stack";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="h-full py-6 px-4">
      <div className="mb-8">
        <h2 className="text-lg font-semibold px-4">Menu</h2>
      </div>

      <nav className="space-y-1">
        <NavItem
          href={ROUTES.dashboard}
          icon={<Home size={20} />}
          label="Dashboard"
          active={pathname === ROUTES.dashboard}
          onClick={onNavigate}
        />
        <NavItem
          href={ROUTES.buildlog}
          icon={<User size={20} />}
          label="Build Log"
          active={pathname === ROUTES.buildlog}
          onClick={onNavigate}
        />
        <NavItem
          href={ROUTES.photos}
          icon={<Image size={20} />}
          label="Photos"
          active={pathname === ROUTES.photos}
          onClick={onNavigate}
        />
        <NavItem
          href={ROUTES.transactions}
          icon={<CreditCard size={20} />}
          label="Transactions"
          active={pathname === ROUTES.transactions}
          onClick={onNavigate}
        />
          <NavItem
          href={ROUTES.budget}
          icon={<DollarSign size={20} />}
          label="Budget"
          active={pathname === ROUTES.budget}
          onClick={onNavigate}
        />
        <NavItem
          href={ROUTES.settings}
          icon={<Settings size={20} />}
          label="Settings"
          active={pathname === ROUTES.settings}
          onClick={onNavigate}
        />
        <NavItem
          href={ROUTES.help}
          icon={<HelpCircle size={20} />}
          label="Help & Support"
          active={pathname === ROUTES.help}
          onClick={onNavigate}
        />
      </nav>

      <div className="mt-auto pt-8">
        <UserButton />
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
