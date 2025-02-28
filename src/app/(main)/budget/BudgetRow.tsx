// BudgetRow.jsx
import React, { useState } from "react";
import { Category } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const BudgetRow = ({
  category,
  budgeted,
  spent,
  className = "",
  onBudgetChange,
  onCategoryNameChange
}: {
  category: Category;
  budgeted: number;
  spent: number;
  className?: string;
  onBudgetChange: (categoryId: number, newAmount: number) => void;
  onCategoryNameChange: (categoryId: number, newName: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetValue, setBudgetValue] = useState(budgeted);
  const [isEditingName, setIsEditingName] = useState(false);
  const [categoryName, setCategoryName] = useState(category.name);

  // Determine text color for remaining amount
  const remaining = budgetValue - spent;

  const percentSpent =
    budgetValue > 0 ? Math.round((spent / budgetValue) * 100) : 0;
  const remainingColor = remaining >= 0 ? "text-green-500" : "text-red-500";

  const handleBudgetEdit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsEditing(false);

    // Convert to number and handle validation
    const newValue = budgetValue;
    if (!isNaN(newValue)) {
      onBudgetChange(category.id, newValue);
    }
  };

  const handleNameEdit = (e: { preventDefault: () => void }) => {
    if (e) e.preventDefault();
     setIsEditing(false);
    // Add function to update the category name in your data store
    onCategoryNameChange(category.id, categoryName);
  };
  return (
    <div className={className}>
      {/* Desktop view */}
      <div className="hidden md:flex items-center py-3 px-3 border-b border-gray-800">
        <div className="flex items-center flex-1">
          {isEditingName ? (
            <form onSubmit={handleNameEdit} className="inline-flex">
              <Input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                onBlur={handleNameEdit}
                autoFocus
                className="w-full min-w-[120px] h-7 bg-gray-700 border-white/50 hover:border-white focus:border-white text-white focus:ring-1 focus:ring-white"
              />
            </form>
          ) : (
            <span
              className="text-sm font-normal text-gray-300 hover:text-white cursor-pointer"
              onClick={() => setIsEditingName(true)}
            >
              {categoryName}
            </span>
          )}
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
                  className="w-20 h-7 bg-gray-800 border border-white/50 hover:border-white focus:border-white text-right text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-1 focus:ring-white"
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

      {/* Mobile view */}
      <div className="md:hidden py-3 px-3 border-b border-gray-800">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-normal text-gray-300">
            {category.name}
          </span>
          <div className={`${remainingColor} text-sm`}>
            {remaining < 0 ? "-" : ""}${Math.abs(remaining).toLocaleString()}
          </div>
        </div>

        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-gray-400">
            ${spent.toLocaleString()} spent
          </div>
          <div className="text-white text-right">
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
                  className="w-20 h-7 bg-gray-800 border border-white/50 hover:border-white focus:border-white text-right text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-1 focus:ring-white"
                  min="0"
                  step="any"
                />
              </form>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="hover:bg-gray-700 px-2 py-1 rounded transition-colors duration-200 text-sm"
              >
                ${budgetValue.toLocaleString()}
              </button>
            )}
          </div>
        </div>

        <div className="w-full">
          <Progress
            value={percentSpent > 100 ? 100 : percentSpent}
            className="h-1 bg-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetRow;
