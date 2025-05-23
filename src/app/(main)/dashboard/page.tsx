"use client";

import BudgetCard from "./components/BudgetCard";
import ToolsNeededCard from "./components/ToolsNeededCard";
import HoursWorkedCard from "./components/HoursWorkedCard";
import { PartsCard } from "./components/PartsCard";
import { useUser } from "@stackframe/stack";
import { usePostHog } from "posthog-js/react";
import { useEffect } from 'react';

export default function Dashboard() {
  const user = useUser();
  const posthog = usePostHog();

  // Only identify the user if they exist and PostHog is available
  useEffect(() => {
    if (posthog && user) {
      // Check if user properties are already set
      const personProperties = posthog.get_property('name');
      
      // Only identify if name property isn't set yet
      if (!personProperties) {
        posthog.identify(user.id, {
          name: user.displayName,
        });
      }
    }
  }, [posthog, user]);
  
  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Your build at a glance</p>
      </header>

      {/* Main Grid Layout */}
      <div className="grid gap-6">
        {/* Progress Overview Section */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <HoursWorkedCard />
          <PartsCard />
          <BudgetCard />
        </section>

        {/* Tools Section */}
        <section className="grid gap-4">
          <ToolsNeededCard />
        </section>
      </div>
    </div>
  );
}
