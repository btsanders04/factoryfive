"use client";

import { useState, useEffect } from "react";
import { PartsTable } from "./components/PartsTable";
import { FilterBar } from "./components/FilterBar";
import { MetricsCards } from "./components/MetricsCards";
import { PartDetailDialog } from "./components/PartDetailDialog";
import { PartData, PartStatus } from "./types";
import { getAllInventoryParts, InventoryPartWithRelations } from "@/data/inventoryParts";

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
    categoryName: part.category.categoryName,
    categoryNumber: part.category.categoryNumber,
    boxId: part.category.boxId,
    boxNumber: part.category.box.boxNumber,
    notes: "", // Default empty string for now
    installDate: undefined,
    inspectionNotes: ""
  };
};

import ScannerModal from "@/app/(main)/inventory/components/ScannerModal";

export default function PartsPage() {
  const [parts, setParts] = useState<PartData[]>([]);
  const [filteredParts, setFilteredParts] = useState<PartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [boxFilter, setBoxFilter] = useState("");
  const [selectedPart, setSelectedPart] = useState<PartData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
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
  }, []);

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
    if (statusFilter) {
      filtered = filtered.filter((part) => part.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((part) => part.categoryName === categoryFilter);
    }

    // Apply box filter
    if (boxFilter) {
      filtered = filtered.filter((part) => part.boxNumber === boxFilter);
    }

    setFilteredParts(filtered);
  }, [parts, searchQuery, statusFilter, categoryFilter, boxFilter]);

  // Extract unique categories and boxes for filters
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(parts.map((part) => part.categoryName)));
    const uniqueBoxes = Array.from(new Set(parts.map((part) => part.boxNumber)));

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
      setSelectedPart(updatedPart);
    } catch (error) {
      console.error("Error updating part:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Parts Inventory</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
          style={{ minWidth: 100 }}
          onClick={() => setScannerOpen(true)}
        >
          Scan
        </button>
      </div>
      <ScannerModal open={scannerOpen} onClose={() => setScannerOpen(false)} onSubmit={function (data: any): void {
        throw new Error("Function not implemented.");
      } } />
      
      <MetricsCards
        totalParts={totalParts}
        receivedParts={receivedParts}
        installedParts={installedParts}
        receivedPercentage={receivedPercentage}
        installedPercentage={installedPercentage}
      />
      
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
        boxes={sections}
        table={null}
      />
      
      <PartsTable
        data={filteredParts}
        isLoading={isLoading}
        setSelectedPart={setSelectedPart}
        setIsDetailOpen={setIsDetailOpen}
        handleUpdatePart={handleUpdatePart}
      />
      {selectedPart && (
        <PartDetailDialog
          isOpen={isDetailOpen}
          setIsOpen={setIsDetailOpen}
          part={selectedPart}
          onUpdate={handleUpdatePart}
          partsData={parts}
          categories={categories}
          sections={sections}
        />
      )}
    </div>
  );
}
