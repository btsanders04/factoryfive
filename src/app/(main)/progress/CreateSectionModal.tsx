"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Prisma, TaskSection } from "@prisma/client";
import { useEffect, useState } from "react";

export default function CreateSectionModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Prisma.TaskSectionCreateInput) => void;
}) {
  const [isFormValid, setIsFormValid] = useState(false);

  const [data, setData] = useState<Prisma.TaskSectionCreateInput>({
    name: "",
    description: "",
  });

  const handleSubmit = () => {
    onSubmit(data);
    setData({ name: "", description: "" });
    onOpenChange(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof TaskSection, value: any) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  useEffect(() => {
    const isValid = !!data.name;
    setIsFormValid(isValid);
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-white">Add Section</DialogTitle>
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
              Name
            </Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter name"
              className="bg-gray-800 border-gray-700 text-white focus:ring-primary-400 focus-visible:ring-primary-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">
              Description
            </Label>
            <Input
              id="name"
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add a description"
              className="bg-gray-800 border-gray-700 text-white focus:ring-primary-400 focus-visible:ring-primary-400"
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
              className={`bg-primary text-white ${
                isFormValid
                  ? "hover:bg-primary-600"
                  : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isFormValid}
            >
              Add transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
