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
      <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0 flex flex-col">
        <div className="flex flex-col h-full">
          {/* Scrollable navigation area */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {Object.values(routes).map((route, index) => (
                <Link
                  key={index}
                  href={route.link}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname.includes(route.link)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
          <div className="border-t p-4 bg-background">
            <div className="flex flex-col space-y-4">
              {!isPublic ? (
                <>
                  <UserButton />
                  <InstallPrompt />
                </>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground">
                    <OAuthButton provider="google" type="sign-in"></OAuthButton>
                  </div>
                  <BuyMeCoffeeWidget />
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
                  pathname.includes(route.link) && "bg-accent text-accent-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  {route.icon}
                  {route.name}
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}

        {/* More dropdown for additional items */}
        {moreRoutes.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>More</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {moreRoutes.map((route, index) => (
                  <li key={index}>
                    <Link
                      href={route.link}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname.includes(route.link) && "bg-accent text-accent-foreground"
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14">
        <div className="flex justify-between items-center h-full">
          {/* Mobile menu button - Left */}
          <div className="flex items-center">
            <MobileNav />
          </div>
          
          {/* Center the desktop navigation */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <DesktopNav />
          </div>
          
          {/* Right side items */}
          <div className="flex items-center justify-end gap-4">
            {!isMobile && (
              isPublic ? (
                <div className="hidden md:flex items-center gap-4">
                  <OAuthButton provider="google" type="sign-in" />
                  <BuyMeCoffeeWidget />
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
