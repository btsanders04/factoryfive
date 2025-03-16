import BudgetCard from "./components/BudgetCard";
import ToolsNeededCard from "./components/ToolsNeededCard";
import HoursWorkedCard from "./components/HoursWorkedCard";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Your build at a glance</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <HoursWorkedCard />
        <BudgetCard />
        <ToolsNeededCard/>
      </div>
    </div>
  );
}
