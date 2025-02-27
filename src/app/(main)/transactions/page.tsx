"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TransactionForm, {
  CreateTransaction,
} from "@/components/TransactionForm";
import {
  addTransaction,
  getAllTransactions,
} from "@/services/transaction.service";
import { TransactionWithRelations } from "@/lib/types/transactions";
import { dateFormat } from "@/lib/utils";
import { getAllCategories } from "@/services/category.service";
import { Category } from "@prisma/client";

export default function TransactionsPage() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState<TransactionWithRelations[]>(
    []
  );

  const [viewableTransactions, setViewableTransactions] = useState<
    TransactionWithRelations[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryFilterId, setActiveCategoryFilterId] = useState<
    number | null
  >(null);
  async function handleAddTransaction(transactionData: CreateTransaction) {
    const transaction = await addTransaction(transactionData);
    const allTransactions = [transaction, ...transactions];
    setTransactions(allTransactions);
    handleCategoryFilter(activeCategoryFilterId);
  }

  function handleCategoryFilter(id: number | null) {
    setActiveCategoryFilterId(id);
    if (id) {
      setViewableTransactions(
        transactions.filter((transaction) => transaction.categoryId === id)
      );
    } else {
      setViewableTransactions(transactions);
    }
  }

  useEffect(() => {
    // Function to fetch categories
    const fetchTransactions = async () => {
      const data = await getAllTransactions();
      setTransactions(data);
      setViewableTransactions(data);
    };
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    fetchTransactions();
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-gray-500">Manage your financial transactions</p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search transactions..."
              className="pl-10 w-full"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Filter</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>All Transactions</DropdownMenuItem>
              <DropdownMenuItem>Expenses Only</DropdownMenuItem>
              <DropdownMenuItem>Income Only</DropdownMenuItem>
              <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem>This Month</DropdownMenuItem>
              <DropdownMenuItem>Last Month</DropdownMenuItem>
              <DropdownMenuItem>Custom Range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <span>Category</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onSelect={() => handleCategoryFilter(null)}>
                All Categories
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onSelect={() => handleCategoryFilter(category.id)}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Transactions Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Builder</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {viewableTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {dateFormat(transaction.date)}
                  </TableCell>
                  <TableCell>{transaction.category.name}</TableCell>
                  <TableCell>{transaction.builder.name}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>{transaction.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <TransactionForm
        open={open}
        onOpenChange={setOpen}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}
