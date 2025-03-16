import BudgetCard from "./components/BudgetCard";
import ToolsNeededCard from "./components/ToolsNeededCard";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col space-y-8"></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BudgetCard />
        <ToolsNeededCard/>
      </div>
    </div>
  );
}
