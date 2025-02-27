/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, ChevronDown, Filter, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TransactionForm, {
  CreateTransaction,
} from "@/app/(main)/transactions/TransactionForm";
import {
  addTransaction,
  deleteTransaction,
  getAllTransactions,
} from "@/app/(main)/transactions/transaction.service";
import { TransactionWithRelations } from "@/lib/types/transactions";
import { getAllCategories } from "@/services/category.service";
import { Category } from "@prisma/client";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";

export default function TransactionsPage() {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );

  const [transactions, setTransactions] = useState<TransactionWithRelations[]>(
    []
  );
  const [categories, setCategories] = useState<Category[]>([]);

  // const columns: ColumnDef<TransactionWithRelations>[]

  async function handleAddTransaction(transactionData: CreateTransaction) {
    const transaction = await addTransaction(transactionData);
    const allTransactions = [transaction, ...transactions];
    setTransactions(allTransactions);
  }

  const confirmDelete = (transactionId: number) => {
    setTransactionToDelete(transactionId);
    setDeleteDialogOpen(true);
  };

  async function handleDelete() {
    if (transactionToDelete) {
      const deletedTransaction = await deleteTransaction(transactionToDelete);
      setTransactionToDelete(null);
      if (deletedTransaction) {
        const filteredTransactions = transactions.filter(
          (transaction) => transaction.id !== deletedTransaction.id
        );
        setTransactions(filteredTransactions);
      }
    }
  }

  useEffect(() => {
    // Function to fetch categories
    const fetchTransactions = async () => {
      const data = await getAllTransactions();
      setTransactions(data);
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
            <p className="text-gray-500">You owe me money</p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Transactions Table */}
        <DataTable
          columns={createColumns(confirmDelete)}
          data={transactions}
          categories={categories}
        ></DataTable>
      </div>

      <TransactionForm
        open={open}
        onOpenChange={setOpen}
        onAddTransaction={handleAddTransaction}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
