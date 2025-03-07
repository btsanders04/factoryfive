"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { dateFormat } from "@/lib/utils";
import { Milestone, Prisma } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddMilestoneModal({
  open,
  milestone,
  onOpenChange,
  onSubmitAdd,
  onSubmitEdit,
}: {
  open: boolean;
  milestone: Milestone | null;
  onOpenChange: (open: boolean) => void;
  onSubmitAdd: (data: Prisma.MilestoneCreateInput) => void;
  onSubmitEdit: (id: number, data: Prisma.MilestoneUpdateInput) => void;
}) {
  const [isFormValid, setIsFormValid] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [data, setData] = useState<Prisma.MilestoneUncheckedCreateInput>({
    title: milestone?.title || "",
    description: milestone?.description || "",
    date: milestone?.date || new Date(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (milestone) {
      onSubmitEdit(milestone.id, data);
    }
    onSubmitAdd(data);
    setData({ title: "", description: "", date: new Date() });
    onOpenChange(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof Milestone, value: any) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const handleClose = () => {
    // Optionally reset when closing
    setData({
      title: "",
      description: "",
      date: new Date(),
    });
    onOpenChange(false);
  };

  useEffect(() => {
    const isValid = !!data.title && !!data.description;
    setIsFormValid(isValid);
  }, [data]);

  useEffect(() => {
    setData({
      title: milestone?.title || "",
      description: milestone?.description || "",
      date: milestone?.date || new Date(),
    });
  }, [milestone]);

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-white">
            {milestone ? "Update" : "Add New"} Milestone
          </DialogTitle>
          <Button
            onClick={() => handleClose()}
            variant="ghost"
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
          ></Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">
              Title
            </Label>
            <Input
              id="name"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
              className="bg-gray-800 border-gray-700 text-white focus:ring-primary-400 focus-visible:ring-primary-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="name"
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add a description"
              className="bg-gray-800 border-gray-700 text-white focus:ring-primary-400 focus-visible:ring-primary-400"
            />
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
                    {data.date ? dateFormat(data.date as Date) : "Select date"}
                  </span>
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 z-50">
                <Calendar
                  mode="single"
                  selected={data.date as Date}
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              onClick={() => handleClose()}
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
              {milestone ? "Update" : "Add"} Milestone
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
