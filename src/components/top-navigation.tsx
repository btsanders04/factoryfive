"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_ROUTES, PUBLIC_ROUTES } from "@/app/routes";
import { OAuthButton, UserButton } from "@stackframe/stack";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import InstallPrompt from "./InstallPrompt";
import BuyMeCoffeeWidget from "./BuyMeCoffeeWidget";

interface TopNavigationProps {
  isPublic?: boolean;
}

export function TopNavigation({ isPublic }: TopNavigationProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Handler to close the sheet when navigation occurs
  const handleNavigate = () => {
    setOpen(false);
  };

  // Get the appropriate routes based on isPublic flag
  const routes = isPublic ? PUBLIC_ROUTES : MAIN_ROUTES;

  // Group routes for dropdown menus
  const mainRoutes = Object.values(routes).slice(0, 5); // First 5 routes for main navigation
  const moreRoutes = Object.values(routes).slice(5); // Rest for "More" dropdown

  // Mobile Navigation Component
  const MobileNav = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0 flex flex-col border-0 bg-[rgba(19,27,46,0.92)] text-foreground backdrop-blur-xl">
        <div className="flex flex-col h-full">
          {/* Scrollable navigation area */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {Object.values(routes).map((route, index) => (
                <Link
                  key={index}
                  href={route.link}
                  className={cn(
                    "flex items-center gap-3 rounded-sm px-3 py-3 text-sm transition-colors ghost-outline",
                    pathname.includes(route.link)
                      ? "bg-[rgba(49,57,77,0.75)] text-foreground"
                      : "text-muted-foreground hover:bg-[rgba(34,42,61,0.9)] hover:text-foreground"
                  )}
                  onClick={handleNavigate}
                >
                  {route.icon}
                  <span>{route.name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Fixed footer area */}
          <div className="p-4 bg-transparent">
            <div className="flex flex-col space-y-4">
              {!isPublic ? (
                <>
                  <UserButton />
                  <InstallPrompt />
                </>
              ) : (
                <>
                  <BuyMeCoffeeWidget />
                  <div className="text-sm text-muted-foreground">
                    <OAuthButton provider="google" type="sign-in"></OAuthButton>
                  </div>
                </>
              )}
              <div className="text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Brandon Sanders. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop Navigation Component
  const DesktopNav = () => (
    <NavigationMenu className="mx-auto">
      <NavigationMenuList className="justify-center">
        {/* Main navigation items */}
        {mainRoutes.map((route, index) => (
          <NavigationMenuItem key={index}>
            <Link href={route.link} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "rounded-sm bg-transparent px-3 lg:px-4 text-[0.72rem] uppercase tracking-[0.28em] text-secondary hover:bg-[rgba(34,42,61,0.8)] hover:text-foreground focus:bg-[rgba(34,42,61,0.8)] focus:text-foreground data-[active]:bg-[rgba(34,42,61,0.8)] data-[state=open]:bg-[rgba(34,42,61,0.8)]",
                  pathname.includes(route.link) && "bg-[rgba(49,57,77,0.75)] text-foreground"
                )}
              >
                <span className="flex items-center gap-1 lg:gap-2">
                  {route.icon}
                  <span className="md:text-sm lg:text-base">{route.name}</span>
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}

        {/* More dropdown for additional items */}
        {moreRoutes.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className="rounded-sm bg-transparent px-3 text-[0.72rem] uppercase tracking-[0.28em] text-secondary hover:bg-[rgba(34,42,61,0.8)] hover:text-foreground data-[active]:bg-[rgba(34,42,61,0.8)] data-[state=open]:bg-[rgba(34,42,61,0.8)]">
              More
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="glass-panel grid w-[400px] gap-3 rounded-sm p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {moreRoutes.map((route, index) => (
                  <li key={index}>
                    <Link
                      href={route.link}
                      className={cn(
                        "block select-none space-y-1 rounded-sm p-3 leading-none no-underline outline-none transition-colors ghost-outline hover:bg-[rgba(34,42,61,0.9)] hover:text-foreground",
                        pathname.includes(route.link) && "bg-[rgba(49,57,77,0.75)] text-foreground"
                      )}
                      onClick={handleNavigate}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        {route.icon}
                        {route.name}
                      </div>
                    </Link>
                  </li>
                ))}

              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 md:px-5">
      <div className="glass-panel container mx-auto h-14 rounded-sm px-4 ghost-outline">
        <div className="flex justify-between items-center h-full">
          {/* Mobile menu button - Left */}
          <div className="flex items-center">
            <MobileNav />
          </div>
          
          {/* Center the desktop navigation */}
          <div className="hidden md:flex md:justify-center md:flex-1 md:relative">
            <DesktopNav />
          </div>
          
          {/* Right side items */}
          <div className="flex items-center justify-end gap-2 lg:gap-4 min-w-[120px] md:min-w-[180px]">
            {!isMobile && (
              isPublic ? (
                <div className="hidden md:flex items-center gap-2 lg:gap-4">
                  <BuyMeCoffeeWidget size="small" />
                  <div className="text-xs sm:text-sm hidden lg:block">
                    <OAuthButton provider="google" type="sign-in" />
                  </div>
                </div>
              ) : (
                <UserButton />
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
