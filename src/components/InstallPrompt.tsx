"use client"

import { useState, useEffect } from "react";
import { Share, Plus } from "lucide-react";

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
    <div>
      {isIOS && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p>To install this app on your iOS device:</p>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>Tap the share button <Share className="inline-block h-3 w-3" /></li>
            <li>Select &quot;Add to Home Screen&quot; <Plus className="inline-block h-3 w-3" /></li>
          </ol>
        </div>
      )}
    </div>
  );
}