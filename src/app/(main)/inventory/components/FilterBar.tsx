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
// Removed dropdown menu imports

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
  // Removed table prop
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
  // Removed table parameter
}: FilterBarProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full">
        <Input
          placeholder="Search parts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_categories">All Categories</SelectItem>
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
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Box" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_boxes">All Boxes</SelectItem>
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
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_statuses">All Statuses</SelectItem>
            <SelectItem value="Not Received">Not Received</SelectItem>
            <SelectItem value="Received">Received</SelectItem>
            <SelectItem value="Installed">Installed</SelectItem>
            <SelectItem value="Damaged">Damaged</SelectItem>
            <SelectItem value="Missing">Missing</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Columns filter removed */}
      </div>
    </div>
  );
} 