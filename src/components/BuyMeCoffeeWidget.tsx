"use client";
import { usePostHog } from "posthog-js/react";
import { cn } from "@/lib/utils";

interface BuyMeCoffeeWidgetProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function BuyMeCoffeeWidget({ size = "medium", className }: BuyMeCoffeeWidgetProps) {
  const posthog = usePostHog();
  const onClick = () => {
    posthog.capture("buy_me_coffee_clicked"); 
  }

  // Determine dimensions based on size prop
  const dimensions = {
    small: { height: '32px', width: '114px' },
    medium: { height: '42px', width: '150px' },
    large: { height: '50px', width: '180px' },
  }[size];
  
  return (
    <a 
      href="https://www.buymeacoffee.com/brandonsanders" 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn("block", className)}
    >
      <img 
        src="/icons/default-yellow.png" 
        alt="Buy Me A Coffee" 
        style={dimensions} 
        className="rounded-md"
      />
    </a>
  )
}