"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PartData, PartStatus } from "../types";

interface UpdateQuantityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  part: PartData | null;
  onUpdateQuantity: (part: PartData) => void;
}

export function UpdateQuantityDialog({
  isOpen,
  onClose,
  part,
  onUpdateQuantity,
}: UpdateQuantityDialogProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Update the quantity when the part changes
  useEffect(() => {
    if (part) {
      setQuantity(part.quantityReceived);
    }
  }, [part]);

  const handleSubmit = () => {
    if (!part) return;

    // Validate the quantity
    if (isNaN(quantity) || quantity < 0) {
      setError("Please enter a valid quantity");
      return;
    }

    if (quantity > part.quantityExpected) {
      setError(`Quantity cannot exceed ${part.quantityExpected}`);
      return;
    }

    // Determine the appropriate status based on the quantity
    let status: PartStatus;
    if (quantity === 0) {
      status = "Not Received";
    } else if (quantity < part.quantityExpected) {
      status = "Partial";
    } else {
      status = "Received";
    }

    // Update the part
    const updatedPart: PartData = {
      ...part,
      quantityReceived: quantity,
      status,
    };

    onUpdateQuantity(updatedPart);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Received Quantity</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {part && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Part Number</Label>
                <div className="col-span-3 font-medium">{part.partNumber}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Description</Label>
                <div className="col-span-3">{part.description}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Total Quantity</Label>
                <div className="col-span-3">{part.quantityExpected}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Received Quantity
                </Label>
                <div className="col-span-3">
                  <Input
                    id="quantity"
                    type="number"
                    min={0}
                    max={part.quantityExpected}
                    value={quantity}
                    onChange={(e) => {
                      setError(null);
                      setQuantity(parseInt(e.target.value) || 0);
                    }}
                    className="w-full"
                  />
                  {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
