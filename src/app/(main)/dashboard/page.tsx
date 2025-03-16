"use client";

import BudgetCard from "./components/BudgetCard";
import ToolsNeededCard from "./components/ToolsNeededCard";
import HoursWorkedCard from "./components/HoursWorkedCard";
import { PartsCard } from "./components/PartsCard";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
