"use client";

import React, { useState } from 'react';
import { Plus, Search, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import TransactionForm from '@/components/TransactionForm';

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  category: string;
  account: string;
  tags?: string[];
}

export default function TransactionsPage() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: 'February 22, 2025',
      merchant: 'Grocery Store',
      amount: 85.42,
      type: 'DEBIT',
      category: 'Food & Dining',
      account: 'Checking',
      tags: ['groceries']
    },
    {
      id: '2',
      date: 'February 20, 2025',
      merchant: 'Gas Station',
      amount: 45.00,
      type: 'DEBIT',
      category: 'Transportation',
      account: 'Credit Card',
      tags: ['auto']
    },
    {
      id: '3',
      date: 'February 18, 2025',
      merchant: 'Paycheck',
      amount: 2500.00,
      type: 'CREDIT',
      category: 'Income',
      account: 'Checking',
      tags: ['salary']
    },
    {
      id: '4',
      date: 'February 15, 2025',
      merchant: 'Coffee Shop',
      amount: 5.75,
      type: 'DEBIT',
      category: 'Food & Dining',
      account: 'Credit Card',
      tags: ['coffee']
    },
    {
      id: '5',
      date: 'February 14, 2025',
      merchant: 'Online Store',
      amount: 124.99,
      type: 'DEBIT',
      category: 'Shopping',
      account: 'Credit Card',
      tags: ['electronics']
    }
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddTransaction = (transactionData: any) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      date: transactionData.date,
      merchant: transactionData.merchant || 'Unknown Merchant',
      amount: parseFloat(transactionData.amount.replace(/[^0-9.-]+/g, '')) || 0,
      type: transactionData.type,
      category: transactionData.category || 'Uncategorized',
      account: transactionData.account || 'Default Account',
      tags: transactionData.tags || []
    };

    setTransactions([newTransaction, ...transactions]);
  };

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
              <DropdownMenuItem>All Categories</DropdownMenuItem>
              <DropdownMenuItem>Food & Dining</DropdownMenuItem>
              <DropdownMenuItem>Shopping</DropdownMenuItem>
              <DropdownMenuItem>Transportation</DropdownMenuItem>
              <DropdownMenuItem>Bills & Utilities</DropdownMenuItem>
              <DropdownMenuItem>Income</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Transactions Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.date}</TableCell>
                  <TableCell>{transaction.merchant}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell>
                    {transaction.tags?.map((tag) => (
                      <Badge key={tag} variant="outline" className="mr-1">
                        {tag}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.type === 'CREDIT' ? 'text-green-500' : ''
                  }`}>
                    {transaction.type === 'CREDIT' ? '+' : ''}
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
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