"use client";

import React, { useEffect, useState } from "react";
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
import {
  addTransaction,
  deleteTransaction,
  getAllTransactions,
  editTransaction,
} from "@/app/(main)/transactions/transaction.service";
import { TransactionWithRelations } from "@/lib/types/transactions";
import { getAllCategories } from "@/services/category.service";
import { Builder, Category, Prisma } from "@prisma/client";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { getAllBuilders } from "@/services/builder.service";
import { PrimaryAddButton } from "@/components/PrimaryAddButton";
import TransactionForm from "./TransactionForm";

export default function TransactionsPage() {
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );
  const [transactionToEdit, setTransactionToEdit] =
    useState<TransactionWithRelations | null>(null);

  const [transactions, setTransactions] = useState<TransactionWithRelations[]>(
    []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [builders, setBuilders] = useState<Builder[]>([]);

  async function handleAddTransaction(
    transactionData: Prisma.TransactionUncheckedCreateInput & {
      transferBuilderId?: number;
    }
  ) {
    const allTransactions = [...transactions];
    const transaction = await addTransaction({
      ...transactionData,
      amount: -transactionData.amount,
    });

    if (transactionData.transferBuilderId) {
      const transferTransaction = await addTransaction({
        ...transactionData,
        builderId: transactionData.transferBuilderId,
        amount: transactionData.amount,
        relatedTransactionId: transaction.id,
      });
      const updateTransaction = await editTransaction({
        ...transaction,
        relatedTransactionId: transferTransaction.id,
      });
      allTransactions.push(updateTransaction, transferTransaction);
    } else {
      allTransactions.push(transaction);
    }
    setTransactions(allTransactions);
  }

  async function handleEditTransaction(
    transactionData: Prisma.TransactionUncheckedUpdateInput
  ) {
    const updatedTransaction = await editTransaction(transactionData);
    setTransactions(
      transactions.map((transaction) => {
        if (transaction.id === updatedTransaction.id) {
          return updatedTransaction;
        } else {
          return transaction;
        }
      })
    );
  }

  const closeTransactionModal = () => {
    setOpenTransactionModal(false);
    setTransactionToEdit(null);
  };

  const confirmDelete = (transactionId: number) => {
    setTransactionToDelete(transactionId);
    setDeleteDialogOpen(true);
  };

  const editTransactionClicked = (transaction: TransactionWithRelations) => {
    setTransactionToEdit(transaction);
    setOpenTransactionModal(true);
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
    const fetchBuilders = async () => {
      const data = await getAllBuilders();
      setBuilders(data);
    };
    fetchTransactions();
    fetchCategories();
    fetchBuilders();
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
          <PrimaryAddButton
            buttonTitle="Add Transaction"
            onClick={() => setOpenTransactionModal(true)}
          ></PrimaryAddButton>
        </div>

        {/* Transactions Table */}
        <DataTable
          columns={createColumns(confirmDelete, editTransactionClicked)}
          data={transactions}
          categories={categories}
        ></DataTable>
      </div>
      {openTransactionModal && (
        <TransactionForm
          open={openTransactionModal}
          transaction={transactionToEdit}
          categories={categories}
          builders={builders}
          onOpenChange={closeTransactionModal}
          onAddTransaction={handleAddTransaction}
          onEditTransaction={handleEditTransaction}
        />
      )}

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
