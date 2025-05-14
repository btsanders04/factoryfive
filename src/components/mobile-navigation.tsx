// components/mobile-navigation.tsx
// This needs to be a client component because it uses React hooks
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export function MobileNavigation({isPublic}: {isPublic?: boolean}) {
  const [open, setOpen] = useState<boolean>(false);

  // Handler to close the sheet when navigation occurs
  const handleNavigate = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 left-4 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground z-50"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          <h2 className="sr-only">Navigation menu</h2>
          <Sidebar isPublic={isPublic} onNavigate={handleNavigate} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
