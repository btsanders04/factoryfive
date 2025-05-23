"use client";
import { usePostHog } from "posthog-js/react";

export default function BuyMeCoffeeWidget() {
  const posthog = usePostHog();
  const onClick = () => {
    posthog.capture("buy_me_coffee_clicked"); 
  }
  return (
    <a 
      href="https://www.buymeacoffee.com/brandonsanders" 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={onClick}
    >
      <img 
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
        alt="Buy Me A Coffee" 
        style={{ height: '42px', width: '150px' }} 
        className="rounded-md"
      />
    </a>
  )
}