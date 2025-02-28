"use client";

import { Button } from "@/components/ui/button";
import { TransactionWithRelations } from "@/lib/types/transactions";
import { dateFormat } from "@/lib/utils";
import { Builder, Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";

export const createColumns = (
  confirmDelete: (id: number) => void,
  editTransaction: (transaction: TransactionWithRelations) => void
): ColumnDef<TransactionWithRelations>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      return dateFormat(cell.getValue<Date>());
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: (row, _, filterValue) => {
      if (filterValue === null) return true; // No filter applied
      const category = row.getValue<Category>("category");
      // If you want to filter by ID
      return category.id === filterValue;
    },
    cell: ({ cell }) => {
      return cell.getValue<Category>().name;
    },
  },
  {
    accessorKey: "builder",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Builder
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const builder = cell.getValue<Builder>();
      const fullName = builder.name;
      const firstLetter = fullName.charAt(0);

      return (
        <>
          {/* Full name on medium screens and up */}
          <span className="hidden md:inline">{fullName}</span>

          {/* First letter only on mobile */}
          <span className="inline md:hidden">{firstLetter}</span>
        </>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const amount = cell.getValue<number>();
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="text-right">
          <button
            onClick={() => editTransaction(transaction)}
            className="hover:text-gray-300 focus:outline-none mr-3"
            aria-label="Edit Transaction"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => confirmDelete(transaction.id)}
            className="text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Delete transaction"
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    },
  },
];
