/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  boxFilter: string;
  setBoxFilter: (box: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categories: string[];
  boxes: string[];
  table?: any;
}

export function FilterBar({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  boxFilter,
  setBoxFilter,
  statusFilter,
  setStatusFilter,
  categories,
  boxes,
  table,
}: FilterBarProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <Input
          placeholder="Search parts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex space-x-2">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={boxFilter}
            onValueChange={setBoxFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Box" />
            </SelectTrigger>
            <SelectContent>
              {boxes.map((box) => (
                <SelectItem key={box} value={box}>
                  {box}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Not Received">Not Received</SelectItem>
              <SelectItem value="Received">Received</SelectItem>
              <SelectItem value="Installed">Installed</SelectItem>
              <SelectItem value="Damaged">Damaged</SelectItem>
              <SelectItem value="Missing">Missing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table && table
              .getAllColumns()
              .filter((column: any) => column.getCanHide())
              .map((column: any) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 