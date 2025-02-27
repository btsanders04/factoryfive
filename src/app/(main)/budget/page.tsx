"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getAllBudgets, upsertBudget } from "@/services/budget.service";
import { BudgetWithRelations } from "@/lib/types/budget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BudgetRow from "@/components/BudgetRow";
import { getCategoriesWithoutBudget } from "@/services/category.service";
import { CategoryWithTransactions } from "@/lib/types/category";
import { ActionType } from "@/lib/types/enum";

export default function TransactionsPage() {
  const [budgets, setBudget] = useState<BudgetWithRelations[]>([]);
  const [unbudgeted, setUnbudgeted] = useState<CategoryWithTransactions[]>([]);
  const [showUnbudgeted, setShowUnbudgeted] = useState(false);

  useEffect(() => {
    // Function to fetch categories
    const fetchBudget = async () => {
      const data = await getAllBudgets();
      setBudget(data);
    };
    const fetchUnbudgetedCategories = async () => {
      const data = await getCategoriesWithoutBudget();
      setUnbudgeted(data);
    };
    fetchBudget();
    fetchUnbudgetedCategories();
  }, []);

  // Toggle unbudgeted categories visibility
  const toggleUnbudgeted = () => {
    setShowUnbudgeted(!showUnbudgeted);
  };

  // Toggle unbudgeted categories visibility
  const updateBudget = async (id: number, amount: number) => {
    const updatedBudget = await upsertBudget(id, amount);
    console.log(updatedBudget);
    if (updatedBudget.action === ActionType.UPDATED) {
      // Replace existing budget
      setBudget(
        budgets.map((budget) =>
          budget.id === updatedBudget.budget.id ? updatedBudget.budget : budget
        )
      );
    } else if (updatedBudget.action === ActionType.CREATED) {
      {
        // Add new budget to array
        setBudget([...budgets, updatedBudget.budget].sort((budget) => budget.id));
        setUnbudgeted(unbudgeted.filter((category) => category.id !== id));
      }
    } else {
      setBudget(
        budgets.filter((budget) => budget.id !== updatedBudget.budget.id)
      );
      setUnbudgeted([
        ...unbudgeted,
        {
          transactions: updatedBudget.budget.category.transactions,
          name: updatedBudget.budget.category.name,
          id: updatedBudget.budget.category.id,
        },
      ].sort((category) => category.id));
    }
  };

  // Calculate totals
  const totalBudgeted = budgets.reduce((sum, cat) => sum + cat.amount, 0);
  const totalSpent = budgets.reduce(
    (sum, cat) =>
      sum +
      cat.category.transactions.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
      ),
    0
  );
  const totalRemaining = totalBudgeted - totalSpent;
  const percentSpent = Math.round((totalSpent / totalBudgeted) * 100);

  return (
    <div className="container mx-auto p-4 bg-gray-900 max-w-4xl">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Budgeted</div>
              <div className="text-2xl font-bold text-white">
                ${totalBudgeted.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Spent</div>
              <div className="text-2xl font-bold text-white">
                ${totalSpent.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Remaining</div>
              <div className="text-2xl font-bold text-green-500">
                ${totalRemaining.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Budget Progress</span>
              <span className="text-gray-400">{percentSpent}%</span>
            </div>
            <Progress value={percentSpent} className="h-2 bg-gray-700" />
          </div>

          {/* Header */}
          <div className="flex items-center py-2 border-b border-gray-700 text-gray-400 text-sm">
            <div className="flex-1">Category</div>
            <div className="flex space-x-8">
              <div className="w-24 text-right">Budgeted</div>
              <div className="w-24 text-right">Spent</div>
              <div className="w-24 text-right">Remaining</div>
            </div>
          </div>

          {/* Budget Rows */}
          <div className="space-y-1">
            {budgets.map((budget) => (
              <BudgetRow
                key={budget.id}
                category={budget.category}
                budgeted={budget.amount}
                spent={budget.category.transactions.reduce(
                  (acc, transaction) => acc + transaction.amount,
                  0
                )}
                onBudgetChange={updateBudget}
              />
            ))}
          </div>

          {/* Unbudgeted Categories */}
          {showUnbudgeted && (
            <div className="space-y-1">
              {unbudgeted.map((category) => (
                <BudgetRow
                  key={category.id}
                  category={category}
                  budgeted={0}
                  spent={
                    category.transactions
                      ? category.transactions.reduce(
                          (acc, transaction) => acc + transaction.amount,
                          0
                        )
                      : 0
                  }
                  className="bg-gray-900 rounded-md"
                  onBudgetChange={updateBudget}
                />
              ))}
            </div>
          )}

          {/* Unbudgeted Items Button */}
          <Button
            variant="ghost"
            className="mt-4 text-gray-400 hover:text-white hover:bg-gray-700"
            size="sm"
            onClick={toggleUnbudgeted}
          >
            {showUnbudgeted ? "Hide" : "Show"} {unbudgeted.length} unbudgeted
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
