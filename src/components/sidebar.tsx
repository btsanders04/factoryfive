// components/sidebar.tsx
// Server component for the sidebar navigation
import Link from "next/link";
import { Home, Settings, User, HelpCircle, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <div className="h-full py-6 px-4">
      <div className="mb-8">
        <h2 className="text-lg font-semibold px-4">Menu</h2>
      </div>
      
      <nav className="space-y-1">
        <NavItem href="/" icon={<Home size={20} />} label="Home" active />
        <NavItem href="/profile" icon={<User size={20} />} label="Build Log" />
        <NavItem href="/settings" icon={<Settings size={20} />} label="Photos" />
        <NavItem href="/settings" icon={<Settings size={20} />} label="Parts List" />
        <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" />
        <NavItem href="/help" icon={<HelpCircle size={20} />} label="Help & Support" />
      </nav>
      
      <div className="mt-auto pt-8">
        <NavItem href="/logout" icon={<LogOut size={20} />} label="Logout" variant="ghost" />
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  variant?: 'default' | 'ghost';
}

function NavItem({
  href,
  icon,
  label,
  active = false,
  variant = "default"
}: NavItemProps) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
        ${active 
          ? "bg-accent text-accent-foreground" 
          : variant === "ghost" 
            ? "text-muted-foreground hover:text-foreground" 
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
