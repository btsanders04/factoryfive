// components/BudgetCard.tsx

"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface CategoryIndividualContributions {
    user: string;
    spent: number;
}

interface BudgetCategoryProps {
  name: string;
  budget: number;
  individualContributions: CategoryIndividualContributions[];
}

interface BudgetCardProps {
  categories: BudgetCategoryProps[];
}

const negativeColor = "bg-red-500"
const postiveColor = "bg-green-500"

const BudgetCategory: React.FC<BudgetCategoryProps> = ({ 
  name, 
  budget,
  individualContributions
}) => {
  // Calculate percentage for progress bar
  const spent = individualContributions.reduce((total, contribution) => total + contribution.spent, 0);
  const percentageSpent = Math.min(100, (spent / budget) * 100);
  const remaining = budget - spent
  const isOverBudget = remaining < 0;
  const color = isOverBudget ? negativeColor : postiveColor;
  const [isOpen, setIsOpen] = React.useState(false);

  
  return (
    <div className="mb-6">
       <div className="flex justify-between items-center mb-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2">
            <span className="text-white font-medium">{name}</span>
            <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
        </div>
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

         {/* Dropdown items */}
      {isOpen && (
        <div className="mt-2 pl-4 space-y-2 border-l-2 border-gray-700">
          {individualContributions.map((contribution, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-300">{contribution.user}</span>
              <span className="text-gray-300">${contribution.spent.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

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
          budget={category.budget}
          individualContributions={category.individualContributions}
        />
      ))}
    </div>
  );
};

export default BudgetCard;