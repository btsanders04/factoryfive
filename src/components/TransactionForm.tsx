import React, { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllCategories } from "@/services/category.service";
import { Builder, Category, Transaction } from "@prisma/client";
import { getAllBuilders } from "@/services/builder.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "./ui/calendar";
import { dateFormat } from "@/lib/utils";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTransaction: (transaction: CreateTransaction) => void;
}
export type CreateTransaction = Omit<Transaction, "id" | "createdAt" | "updatedAt">;

const TransactionForm: React.FC<TransactionFormProps> = ({
  open,
  onOpenChange,
  onAddTransaction,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [builders, setBuilders] = useState<Builder[]>([]);

  // In your component
  const [calendarOpen, setCalendarOpen] = useState(false);

  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState<string | null>(null);

  const [transactionData, setTransactionData] = useState<CreateTransaction>({
    amount: 0,
    description: "",
    date: new Date(),
    builderId: 0,
    categoryId: 0,
    notes: "",
    tags: [],
  });

  useEffect(() => {
    // Function to fetch categories
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    const fetchBuilders = async () => {
      const data = await getAllBuilders();
      setBuilders(data);
    };
    fetchCategories();
    fetchBuilders();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof Transaction, value: any) => {
    setTransactionData({
      ...transactionData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction(transactionData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-white">Add transaction</DialogTitle>
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
          ></Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-300">
              Amount
            </Label>
            <Input
              id="amount"
              value={transactionData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="$0.00"
              className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500 focus-visible:ring-orange-500"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">
              Category
            </Label>
            <Select
              onValueChange={(value) => handleChange("categoryId", parseInt(value))}
              value={transactionData.categoryId.toString()}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500">
                <SelectValue placeholder="Search categories..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Builder */}
          <div className="space-y-2">
            <Label htmlFor="builder" className="text-gray-300">
              Builder
            </Label>
            <Select
              onValueChange={(value) => handleChange("builderId",  parseInt(value))}
              value={transactionData.builderId.toString()}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500">
                <SelectValue placeholder="Select a User" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {builders.map((builder) => (
                  <SelectItem key={builder.id} value={builder.id.toString()}>
                    {builder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-300">
              Date
            </Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <span>
                    {transactionData.date
                      ? dateFormat(transactionData.date)
                      : "Select date"}
                  </span>
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800">
                <Calendar
                  mode="single"
                  selected={transactionData.date}
                  onSelect={(date) => {
                    handleChange("date", date || new Date());
                    setCalendarOpen(false);
                  }}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-300">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add a note..."
              value={transactionData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white resize-none focus:ring-orange-500 focus-visible:ring-orange-500"
            />
          </div>

          {/* Tags
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-gray-300">
              Tags
            </Label>
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500">
                <SelectValue placeholder="Search tags..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="tax-deductible">Tax Deductible</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              Add transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
