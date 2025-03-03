import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Category, Prisma } from "@prisma/client";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (category: Prisma.CategoryCreateInput) => void;
}

const CategoryForm: React.FC<TransactionFormProps> = ({
  open,
  onOpenChange,
  onAddCategory,
}) => {
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState<string | null>(null);

  const [categoryData, setCategoryData] = useState<Prisma.CategoryCreateInput>({
    name: "",
    description: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof Category, value: any) => {
    setCategoryData({
      ...categoryData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory(categoryData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-white">Add Category</DialogTitle>
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
          ></Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Name
            </Label>
            <Input
              id="name"
              value={categoryData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Add Category Name"
              className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500 focus-visible:ring-orange-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add a description..."
              value={categoryData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white resize-none focus:ring-orange-500 focus-visible:ring-orange-500"
            />
          </div>

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
              disabled={!categoryData.name.trim()}
            >
              Add Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
