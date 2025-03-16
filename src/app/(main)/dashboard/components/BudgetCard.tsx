// components/BudgetCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BudgetWithRelations } from "@/lib/types/budget";
import { getAllBudgets } from "@/data/budget";
import { TransactionWithBuilder } from "@/lib/types/transactions";
import { Builder } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

interface CategoryIndividualContributions {
  builder: Builder;
  amount: number;
}

interface BudgetCategoryProps {
  name: string;
  budget: number;
  individualContributions: CategoryIndividualContributions[];
}

const negativeColor = "bg-red-500";
const postiveColor = "bg-green-500";

const getIndividualContributions = (transactions: TransactionWithBuilder[]) => {
  const builderAmounts = transactions.reduce((acc, transaction) => {
    const builderId = transaction.builder.id;
    const existingBuilder = acc.find((item) => item.builder.id === builderId);

    if (existingBuilder) {
      // If builder exists, add to their amount
      existingBuilder.amount -= transaction.amount;
    } else {
      // If builder doesn't exist, add new entry
      acc.push({
        builder: transaction.builder,
        amount: Math.abs(transaction.amount),
      });
    }

    return acc;
  }, [] as CategoryIndividualContributions[]);
  return builderAmounts;
};

const BudgetCategory: React.FC<BudgetCategoryProps> = ({
  name,
  budget,
  individualContributions,
}) => {
  // Calculate percentage for progress bar
  const spent = Math.abs(individualContributions.reduce(
    (total, contribution) => total + contribution.amount,
    0
  ));
  const percentageSpent = Math.min(100, (spent / budget) * 100);
  const remaining = Math.abs(budget - spent);
  const isOverBudget = remaining < 0;
  const color = isOverBudget ? negativeColor : postiveColor;
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mb-4 border-b border-gray-800 pb-4 last:border-0"
    >
      <CollapsibleTrigger className="w-full">
        <div className="flex justify-between items-center mb-1 cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{name}</span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
          <span className="text-gray-400">
            ${budget.toLocaleString()} budget
          </span>
        </div>
      </CollapsibleTrigger>

      <div className="relative h-2 w-full bg-gray-800 rounded-full mb-1">
        <div
          className={`absolute top-0 left-0 h-full rounded-full ${color}`}
          style={{ width: `${percentageSpent}%` }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-white">${spent.toLocaleString()} spent</span>
        <span className={isOverBudget ? "text-red-500" : "text-green-500"}>
          {isOverBudget ? "-" : ""}${remaining.toLocaleString()}{" "}
          remaining
        </span>
      </div>

      <CollapsibleContent>
        <div className="mt-2 pl-4 space-y-2 border-l-2 border-gray-700">
          {individualContributions.map((contribution, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-300">{contribution.builder.name}</span>
              <span className="text-gray-300">
                ${contribution.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const BudgetCard = () => {
  const [budgets, setBudgets] = useState<BudgetWithRelations[]>([]);
  useEffect(() => {
    // Function to fetch categories
    const fetchBudgets = async () => {
      const data = await getAllBudgets();
      setBudgets(data);
    };
    fetchBudgets();
  }, []);

  // Calculate total budget and spent
  const totalBudget = budgets.reduce((total, budget) => total + budget.amount, 0);
  const totalSpent = budgets.reduce((total, budget) => {
    const spent = budget.category.transactions.reduce(
      (sum, transaction) => sum + Math.abs(transaction.amount),
      0
    );
    return total + spent;
  }, 0);

  return (
    <div className="flex justify-center w-full">
      <Card className="shadow-md w-full h-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Budget</CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.map((budget, index) => (
            <BudgetCategory
              key={index}
              name={budget.category.name}
              budget={budget.amount}
              individualContributions={getIndividualContributions(
                budget.category.transactions
              )}
            />
          ))}
          
          {/* Summary and link to budget page */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Total Budget:</span>
              <span>${totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="font-medium">Total Spent:</span>
              <span>${totalSpent.toLocaleString()}</span>
            </div>
            <Link 
              href="/budget" 
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline block"
            >
              View full budget →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetCard;
