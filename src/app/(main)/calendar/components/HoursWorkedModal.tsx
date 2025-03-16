"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dateFormat } from "@/lib/utils";
import { useState } from "react";

export default function HoursWorkedModal({
  open,
  totalHours,
  date,
  onOpenChange,
  onHoursSubmitted
}: {
  open: boolean;
  totalHours: number;
  date: Date;
  onOpenChange: (open: boolean) => void,
  onHoursSubmitted: (selectedDate: Date, hours: number) => void
}) {
  const [modalOpen] = useState(open);
  const [hoursWorked, setHoursWorked] = useState(totalHours);
  
  const handleSubmit = () => {
    onHoursSubmitted(date, hoursWorked)
    setHoursWorked(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>Hours Worked</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            {dateFormat(date)}
          </p>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="hours">Hours Worked</Label>
            <Input
              type="number"
              id="hours"
              min="0"
              max="24"
              step="0.5"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(parseFloat(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
