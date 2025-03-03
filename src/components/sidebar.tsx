/* eslint-disable jsx-a11y/alt-text */
"use client";

// components/sidebar.tsx
import Link from "next/link";
import {usePathname} from "next/navigation";
import {
    Home,
    Settings,
    User,
    HelpCircle,
    CreditCard,
    Image,
    DollarSign, Drill,
} from "lucide-react";
import {ROUTES} from "@/app/routes";
import {UserButton} from "@stackframe/stack";

interface SidebarProps {
    onNavigate?: () => void;
}

export function Sidebar({onNavigate}: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="h-full py-6 px-4">
            <div className="mb-8">
                <h2 className="text-lg font-semibold px-4">Menu</h2>
            </div>

            <nav className="space-y-1">
                <NavItem
                    href={ROUTES.dashboard.link}
                    icon={<Home size={20}/>}
                    label={ROUTES.dashboard.name}
                    active={pathname === ROUTES.dashboard.link}
                    onClick={onNavigate}
                />
                <NavItem
                    href={ROUTES.buildlog.link}
                    icon={<User size={20}/>}
                    label={ROUTES.buildlog.name}
                    active={pathname === ROUTES.buildlog.link}
                    onClick={onNavigate}
                />
                <NavItem
                    href={ROUTES.photos.link}
                    icon={<Image size={20}/>}
                    label={ROUTES.photos.name}
                    active={pathname === ROUTES.photos.link}
                    onClick={onNavigate}
                />
                <NavItem
                    href={ROUTES.transactions.link}
                    icon={<CreditCard size={20}/>}
                    label={ROUTES.transactions.name}
                    active={pathname === ROUTES.transactions.link}
                    onClick={onNavigate}
                />
                <NavItem
                    href={ROUTES.budget.link}
                    icon={<DollarSign size={20}/>}
                    label={ROUTES.budget.name}
                    active={pathname === ROUTES.budget.link}
                    onClick={onNavigate}
                />
                <NavItem
                    href={ROUTES.tools.link}
                    icon={<Drill size={20}/>}
                    label={ROUTES.tools.name}
                    active={pathname === ROUTES.tools.link}
                    onClick={onNavigate}
                />
                <NavItem
                    href={ROUTES.settings.link}
                    icon={<Settings size={20}/>}
                    label={ROUTES.settings.name}
                    active={pathname === ROUTES.settings.link}
                    onClick={onNavigate}
                />
                <NavItem
                    href={ROUTES.help.link}
                    icon={<HelpCircle size={20}/>}
                    label={ROUTES.help.name}
                    active={pathname === ROUTES.help.link}
                    onClick={onNavigate}
                />
            </nav>

            <div className="mt-auto pt-8">
                <UserButton/>
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
