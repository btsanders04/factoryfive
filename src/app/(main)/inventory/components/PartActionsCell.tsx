"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PartData, PartStatus } from "../types";
import { UpdateQuantityDialog } from "./UpdateQuantityDialog";

interface PartActionsCellProps {
  part: PartData;
  onUpdatePart: (part: PartData) => void;
}

export function PartActionsCell({ part, onUpdatePart }: PartActionsCellProps) {
  const [updateQuantityOpen, setUpdateQuantityOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setUpdateQuantityOpen(true)}>
            Update Quantity
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const updatedPart = {
                ...part,
                status: "Not Received" as PartStatus,
                quantityReceived: 0,
              };
              onUpdatePart(updatedPart);
            }}
          >
            Mark as Not Received
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const updatedPart = {
                ...part,
                status: "Installed" as PartStatus,
              };
              onUpdatePart(updatedPart);
            }}
          >
            Mark as Installed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Update Quantity Dialog */}
      <UpdateQuantityDialog
        isOpen={updateQuantityOpen}
        onClose={() => setUpdateQuantityOpen(false)}
        part={part}
        onUpdateQuantity={onUpdatePart}
      />
    </>
  );
}
