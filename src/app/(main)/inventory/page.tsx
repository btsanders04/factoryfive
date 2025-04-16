"use client";

import { useState, useEffect } from "react";
import { PartsTable } from "./components/PartsTable";
import { FilterBar } from "./components/FilterBar";
import { MetricsCards } from "./components/MetricsCards";
import { PartData, PartStatus } from "./types";
import { getAllInventoryParts, InventoryPartWithRelations } from "@/data/inventoryParts";
import ScannerModal from "@/app/(main)/inventory/components/ScannerModal";

// Convert InventoryPart from Prisma to our PartData type
const mapInventoryPartToPartData = (part: InventoryPartWithRelations): PartData => {
  // Determine status based on quantities
  let status: PartStatus = "Not Received";
  if (part.quantityReceived > 0) {
    status = part.quantityReceived < part.quantityExpected ? "Partial" : "Complete";
  }
  
  return {
    id: part.id.toString(),
    partNumber: part.partNumber,
    description: part.description,
    quantityExpected: part.quantityExpected,
    quantityReceived: part.quantityReceived,
    status: status,
    categoryId: part.categoryId,
    categoryName: part.category?.categoryName,
    categoryNumber: part.category?.categoryNumber,
    boxId: part.box?.id,
    boxNumber: part.box?.boxNumber,
    notes: "", // Default empty string for now
    installDate: undefined,
    inspectionNotes: ""
  };
};

export default function PartsPage() {
  const [parts, setParts] = useState<PartData[]>([]);
  const [filteredParts, setFilteredParts] = useState<PartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all_statuses");
  const [categoryFilter, setCategoryFilter] = useState("all_categories");
  const [boxFilter, setBoxFilter] = useState("all_boxes");
  // const [selectedPart, setSelectedPart] = useState<PartData | null>(null);
  // const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  
  // State for filter options
  const [categories, setCategories] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  
  // State for metrics
  const [totalParts, setTotalParts] = useState(0);
  const [receivedParts, setReceivedParts] = useState(0);
  const [installedParts, setInstalledParts] = useState(0);
  const [receivedPercentage, setReceivedPercentage] = useState(0);
  const [installedPercentage, setInstalledPercentage] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch parts data
  useEffect(() => {
    const fetchParts = async () => {
      setIsLoading(true);
      try {
        const inventoryParts = await getAllInventoryParts();
        const mappedParts = inventoryParts.map(mapInventoryPartToPartData);
        setParts(mappedParts);
        setFilteredParts(mappedParts);
      } catch (error) {
        console.error("Error fetching parts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParts();
  }, [refreshTrigger]); // Only re-run when refreshTrigger changes
  
  const onSubmit = () => {
      setScannerOpen(false);
      // Increment the refresh trigger to fetch fresh data
      setRefreshTrigger(prev => prev + 1);
  };

  // Filter parts based on search query and filters
  useEffect(() => {
    let filtered = [...parts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (part) =>
          part.partNumber.toLowerCase().includes(query) ||
          part.description.toLowerCase().includes(query) ||
          part.notes?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all_statuses') {
      filtered = filtered.filter((part) => part.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all_categories') {
      filtered = filtered.filter((part) => part.categoryName === categoryFilter);
    }

    // Apply box filter
    if (boxFilter && boxFilter !== 'all_boxes') {
      filtered = filtered.filter((part) => part.boxNumber === boxFilter);
    }

    setFilteredParts(filtered);
  }, [parts, searchQuery, statusFilter, categoryFilter, boxFilter]);

  // Extract unique categories and boxes for filters
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(parts.filter((part) => part.categoryName !== undefined).map((part) => part.categoryName))) as string[];
    
    // Get unique boxes and sort them numerically
    const boxNumbers = parts
      .filter(part => part.boxNumber) // Filter out undefined/null box numbers
      .map(part => part.boxNumber as string);
    const uniqueBoxes = Array.from(new Set(boxNumbers))
      .sort((a, b) => {
        // Convert box numbers to integers for proper numerical sorting
        const numA = parseInt(a.replace(/\D/g, ''));
        const numB = parseInt(b.replace(/\D/g, ''));
        return numA - numB;
      });

    setCategories(uniqueCategories);
    setSections(uniqueBoxes);

    // Calculate metrics
    const total = parts.reduce((acc, part) => acc + part.quantityExpected, 0);
    const received = parts.reduce((acc, part) => acc + part.quantityReceived, 0);
    const installed = parts.filter((part) => part.status === "Installed").length;

    setTotalParts(total);
    setReceivedParts(received);
    setInstalledParts(installed);
    setReceivedPercentage(total > 0 ? Math.round((received / total) * 100) : 0);
    setInstalledPercentage(
      parts.length > 0 ? Math.round((installed / parts.length) * 100) : 0
    );
  }, [parts]);

  // Handle updating a part
  const handleUpdatePart = async (updatedPart: PartData) => {
    try {
      // TODO: Update the part in the database
      // const response = await fetch(`/api/inventory-parts/${updatedPart.id}`, {
      //   method: "PUT",
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedPart)
      // });
      
      // For now, just update the local state
      setParts((prevParts) =>
        prevParts.map((part) => (part.id === updatedPart.id ? updatedPart : part))
      );
      // setSelectedPart(updatedPart);
    } catch (error) {
      console.error("Error updating part:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Parts Inventory</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow w-full sm:w-auto"
          onClick={() => setScannerOpen(true)}
        >
          Scan
        </button>
      </div>
      <ScannerModal open={scannerOpen} onClose={() => setScannerOpen(false)} onSubmit={onSubmit} />
      
      <div className="overflow-hidden">
        <MetricsCards
          totalParts={totalParts}
          receivedParts={receivedParts}
          installedParts={installedParts}
          receivedPercentage={receivedPercentage}
          installedPercentage={installedPercentage}
        />
      </div>
      
      <div className="overflow-x-auto">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          boxFilter={boxFilter}
          setBoxFilter={setBoxFilter}
          categories={categories}
          boxes={sections}        />
      </div>
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-full sm:rounded-lg">
          <PartsTable
            data={filteredParts}
            isLoading={isLoading}
            // setSelectedPart={setSelectedPart}
            // setIsDetailOpen={setIsDetailOpen}
            handleUpdatePart={handleUpdatePart}
          />
        </div>
      </div>
    </div>
  );
}
