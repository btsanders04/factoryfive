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

export default function HoursWorkedModal(
  open: boolean,
  totalHours: number,
  date: Date,
  onOpenChange,
  onUpdateHours
) {
  const [modalOpen, setModalOpen] = useState(open);
  const [hoursWorked, setHoursWorked] = useState(totalHours);
  const [selectedDate] = useState(date);

  // Handle form submission
  const handleSubmit = () => {
    console.log("Date:", selectedDate);
    console.log("Hours worked:", hoursWorked);
    // Here you would typically save this data

    // Clear form and close modal
    setHoursWorked(0);
    setModalOpen(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hours Worked</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            {dateFormat(selectedDate)}
          </p>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="hours">Hours Worked</Label>
            <Input
              type="number"
              id="hours"
              min="0"
              step="0.5"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setModalOpen(false)}
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
