// components/BudgetCard.tsx
import React from "react";
import { ChevronDown } from "lucide-react";

interface BudgetCategoryProps {
  name: string;
  spent: number;
  budget: number;
}

interface BudgetCardProps {
  month: string;
  year: string;
  categories: BudgetCategoryProps[];
}

const negativeColor = "bg-red-500"
const postiveColor = "bg-green-500"

const BudgetCategory: React.FC<BudgetCategoryProps> = ({ 
  name, 
  spent, 
  budget
}) => {
  // Calculate percentage for progress bar
  const percentageSpent = Math.min(100, (spent / budget) * 100);
  const remaining = budget - spent
  const isOverBudget = remaining < 0;
  const color = isOverBudget ? negativeColor : postiveColor;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-white font-medium">{name}</span>
        <span className="text-gray-400">${budget.toLocaleString()} budget</span>
      </div>
      
      <div className="relative h-2 w-full bg-gray-800 rounded-full mb-1">
        <div 
          className={`absolute top-0 left-0 h-full rounded-full ${color}`}
          style={{ width: `${percentageSpent}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-white">${spent.toLocaleString()} spent</span>
        <span className={isOverBudget ? "text-red-500" : "text-green-500"}>
          {isOverBudget ? "-" : ""}${Math.abs(remaining).toLocaleString()} remaining
        </span>
      </div>
    </div>
  );
};

const BudgetCard: React.FC<BudgetCardProps> = ({ categories }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6 w-full max-w-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-white">Budget</h2>
        </div>
        
        <div className="flex items-center gap-1 text-white bg-gray-800 px-3 py-1 rounded cursor-pointer hover:bg-gray-700 transition-colors">
          <span>Expenses</span>
          <ChevronDown size={18} />
        </div>
      </div>
      
      {categories.map((category, index) => (
        <BudgetCategory
          key={index}
          name={category.name}
          spent={category.spent}
          budget={category.budget}
        />
      ))}
    </div>
  );
};

export default BudgetCard;