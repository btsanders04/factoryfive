"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, Search } from "lucide-react";
import { Category } from "@prisma/client";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  categories,
}: DataTableProps<TData, TValue> & { categories: Category[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function handleCategoryFilter(id: number | null) {
    table.getColumn("category")?.setFilterValue(id);
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Get header label safely
  const getHeaderLabel = (columnId: string) => {
    const column = table.getColumn(columnId);
    if (!column) return columnId;

    const headerDef = column.columnDef.header;
    if (typeof headerDef === "string") return headerDef;
    return (
      columnId.charAt(0).toUpperCase() +
      columnId.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

  // Function to render the card view for mobile using shadcn/ui Card component
  const renderCardView = () => {
    return (
      <div className="space-y-4">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const actionsColumn = row
              .getAllCells()
              .find((cell) => cell.column.id === "actions");
            const amountColumn = row
              .getAllCells()
              .find((cell) => cell.column.id === "amount");

               // // Find amount/price column if it exists
            const categoryColumn = row
              .getAllCells()
              .find((cell) => cell.column.id === "category");

            return (
              <Card key={row.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {amountColumn && (
                          <div className="font-semibold">
                            {flexRender(
                              amountColumn.column.columnDef.cell,
                              amountColumn.getContext()
                            )}
                          </div>
                        )}
                      </CardTitle>
                     
                    </div>
                    <Badge variant="outline"> {categoryColumn && (
                          <div className="font-semibold">
                            {flexRender(
                              categoryColumn.column.columnDef.cell,
                              categoryColumn.getContext()
                            )}
                          </div>
                        )}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="pb-2 pt-0">
                  <div className="space-y-2">
                    {row
                      .getVisibleCells()
                      .filter(
                        (cell) =>
                          cell.column.id !== "amount" &&
                          cell.column.id !== "category" &&
                          cell.column.id !== "actions"
                      )
                      .map((cell) => {
                        // Skip cells that are already shown in the card header/title
                        return (
                          <div
                            key={cell.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-muted-foreground font-medium">
                              {getHeaderLabel(cell.column.id)}
                            </span>
                            <span>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-4 pb-4">
                  Actions
                  {actionsColumn && (
                    <div className="font-semibold">
                      {flexRender(
                        actionsColumn.column.columnDef.cell,
                        actionsColumn.getContext()
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            No results found.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Filters and Search - Works on both mobile and desktop */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-10 w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>All Transactions</DropdownMenuItem>
            <DropdownMenuItem>Expenses Only</DropdownMenuItem>
            <DropdownMenuItem>Income Only</DropdownMenuItem>
            <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
            <DropdownMenuItem>This Month</DropdownMenuItem>
            <DropdownMenuItem>Last Month</DropdownMenuItem>
            <DropdownMenuItem>Custom Range</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <span>Category</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onSelect={() => handleCategoryFilter(null)}>
              All Categories
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onSelect={() => handleCategoryFilter(category.id)}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Conditional Rendering based on screen size */}
      {isMobile ? (
        // Card View for Mobile using shadcn/ui Card
        renderCardView()
      ) : (
        // Table View for Desktop
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination - Works for both views */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
