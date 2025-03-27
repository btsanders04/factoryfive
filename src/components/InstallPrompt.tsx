"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Share, Plus } from "lucide-react";

interface CustomWindow extends Window {
  MSStream?: unknown;
}

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as CustomWindow).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Download className="h-4 w-4" />
          Install App
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1 space-y-2">
        <Button className="w-full" size="sm">
          Add to Home Screen
        </Button>
        {isIOS && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>To install this app on your iOS device:</p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Tap the share button <Share className="inline-block h-3 w-3" /></li>
              <li>Select &quot;Add to Home Screen&quot; <Plus className="inline-block h-3 w-3" /></li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}