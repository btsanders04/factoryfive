// BudgetRow.jsx
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { Input } from "@/components/ui/input";

const BudgetRow = ({
  category,
  budgeted,
  spent,
  className = "",
  onBudgetChange,
}: {
  category: Category;
  budgeted: number;
  spent: number;
  className?: string;
  onBudgetChange?: (categoryId: number, newAmount: number) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetValue, setBudgetValue] = useState(budgeted);

  // Determine text color for remaining amount
  const remaining = budgetValue - spent;
  const remainingColor = remaining >= 0 ? "text-green-500" : "text-red-500";

  const handleBudgetEdit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsEditing(false);

    // Convert to number and handle validation
    const newValue = budgetValue;
    if (!isNaN(newValue) && onBudgetChange) {
      onBudgetChange(category.id, newValue);
    }
  };

  return (
    <>
      <div
        className={`flex items-center py-3 px-3 border-b border-gray-800 ${className}`}
      >
        <div className="flex items-center flex-1">
          <span className={cn("text-sm", "font-normal text-gray-300")}>
            {category.name}
          </span>
        </div>

        <div className="flex space-x-8">
          <div className="w-24 text-right text-white">
            {isEditing ? (
              <form onSubmit={handleBudgetEdit} className="inline-flex">
                <Input
                  type="number"
                  value={budgetValue}
                  onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    setBudgetValue(isNaN(parsed) ? 0 : parsed);
                  }}
                  onBlur={handleBudgetEdit}
                  autoFocus
                  className="w-20 h-7 bg-gray-700 border-gray-600 text-right text-white  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  step="any"
                />
              </form>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="hover:bg-gray-700 px-2 py-1 rounded transition-colors duration-200"
              >
                ${budgetValue.toLocaleString()}
              </button>
            )}
          </div>
          <div className="w-24 text-right text-white">
            ${spent.toLocaleString()}
          </div>
          <div className={`w-24 text-right ${remainingColor}`}>
            {remaining < 0 ? "-" : ""}${Math.abs(remaining).toLocaleString()}
          </div>
        </div>
      </div>
    </>
  );
};

export default BudgetRow;
