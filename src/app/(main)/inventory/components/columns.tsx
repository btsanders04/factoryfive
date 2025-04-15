import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./Badges";
import { PartData, PartStatus } from "../types";

interface CreateColumnsProps {
  setSelectedPart: (part: PartData) => void;
  setIsDetailOpen: (open: boolean) => void;
  handleUpdatePart: (part: PartData) => void;
}

export const createColumns = ({
  setSelectedPart,
  setIsDetailOpen,
  handleUpdatePart,
}: CreateColumnsProps): ColumnDef<PartData>[] => [
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const part = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setSelectedPart(part);
                setIsDetailOpen(true);
              }}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const updatedPart = {
                  ...part,
                  status: "Complete" as PartStatus,
                  quantityReceived: part.quantityExpected,
                };
                handleUpdatePart(updatedPart);
              }}
            >
              Mark as Complete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const updatedPart = {
                  ...part,
                  status: "Installed" as PartStatus,
                };
                handleUpdatePart(updatedPart);
              }}
            >
              Mark as Installed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];