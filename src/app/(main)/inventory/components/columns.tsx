import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { StatusBadge } from "./Badges";
import { PartData } from "../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCheckIcon } from "lucide-react";
import { useState } from "react";
import { PartActionsCell } from "./PartActionsCell";

// Separate React component for the Mark Received button
function MarkReceivedButton({ part, handleUpdatePart }: { part: PartData; handleUpdatePart: (part: PartData) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
            onClick={() => {
              setIsLoading(true);
              // Create updated part object
              const updatedPart = {
                ...part,
                status: "Received",
                quantityReceived: part.quantityExpected,
              };
              
              // Call the handleUpdatePart function from props
              handleUpdatePart(updatedPart);
              
              // Set loading to false after a short delay to show the spinner
              setTimeout(() => setIsLoading(false), 300);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <CheckCheckIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Mark as received</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mark as received</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface CreateColumnsProps {
  handleUpdatePart: (part: PartData) => void;
}

export const createColumns = ({
  handleUpdatePart,
}: CreateColumnsProps): ColumnDef<PartData>[] => {
  // State for the update quantity dialog

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // ID column removed as requested
    {
      accessorKey: "partNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Part Number
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("partNumber")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.getValue("status")} />
      ),
    },
    {
      accessorKey: "boxNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Box
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("boxNumber")}</div>,
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) => <div>{row.getValue("categoryName")}</div>,
    },
    {
      accessorKey: "quantityExpected",
      header: "Qty",
      cell: ({ row }) => <div className="text-center">{row.getValue("quantityExpected")}</div>,
    },
    {
      accessorKey: "quantityReceived",
      header: "Received",
      cell: ({ row }) => {
        const quantity = row.getValue<number>("quantityExpected");
        const received = row.getValue<number>("quantityReceived");
        return (
          <div className="text-center">
            {received} / {quantity}
          </div>
        );
      },
    },
    {
      id: "markReceived",
      header: "",
      cell: ({ row }) => {
        const part = row.original;
        
        // Only show the button if the part is not fully received
        const isFullyReceived = part.quantityReceived >= part.quantityExpected;
        const isNotReceived = part.status === "Not Received" || part.status === "Partial";
        
        if (isFullyReceived || !isNotReceived) {
          return null;
        }
        
        return <MarkReceivedButton part={part} handleUpdatePart={handleUpdatePart} />;
      },
      enableSorting: false,
    },
  // ID column removed as requested

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const part = row.original;
      return <PartActionsCell part={part} onUpdatePart={handleUpdatePart} />;
    },
  },
];
};