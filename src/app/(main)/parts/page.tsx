"use client";

import { useState, useEffect } from "react";
import { PartsTable } from "./components/PartsTable";
import { FilterBar } from "./components/FilterBar";
import { MetricsCards } from "./components/MetricsCards";
import { PartDetailDialog } from "./components/PartDetailDialog";
import { PartData, PartStatus } from "./types";
import { getAllPartsInventory } from "@/data/partsinventory";
import { PartsInventory } from "@prisma/client";

// Convert PartsInventory from Prisma to our PartData type
const mapPartsInventoryToPartData = (part: PartsInventory): PartData => ({
  id: part.id.toString(),
  part: part.part,
  status: part.status as PartStatus,
  section: part.section,
  category: part.category,
  quantity: part.quantity,
  quantityReceived: part.quantityReceived,
  notes: part.notes,
  estimatedInstallTime: part.estimatedInstallTime,
  installDifficulty: part.installDifficulty,
  manualPageReference: part.manualPageReference,
  isOptional: part.isOptional,
  installedDate: part.installDate ? part.installDate.toISOString().split('T')[0] : undefined,
  dependencies: part.dependencies.map(id => id.toString()),
  inspectionNotes: part.inspectionNotes,
});

export default function PartsPage() {
  const [parts, setParts] = useState<PartData[]>([]);
  const [filteredParts, setFilteredParts] = useState<PartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [selectedPart, setSelectedPart] = useState<PartData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch parts data
  useEffect(() => {
    const fetchParts = async () => {
      setIsLoading(true);
      try {
        const partsInventory = await getAllPartsInventory();
        const mappedParts = partsInventory.map(mapPartsInventoryToPartData);
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
    let result = [...parts];

    if (searchQuery) {
      result = result.filter(
        (part) =>
          part.part.toLowerCase().includes(searchQuery.toLowerCase()) ||
          part.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((part) => part.status === statusFilter);
    }

    if (categoryFilter) {
      result = result.filter((part) => part.category === categoryFilter);
    }

    if (sectionFilter) {
      result = result.filter((part) => part.section === sectionFilter);
    }

    setFilteredParts(result);
  }, [parts, searchQuery, statusFilter, categoryFilter, sectionFilter]);

  // Get unique categories and sections for filters
  const categories = [...new Set(parts.map((part) => part.category))];
  const sections = [...new Set(parts.map((part) => part.section))];

  // Calculate metrics
  const totalParts = parts.reduce((acc, part) => acc + part.quantity, 0);
  const receivedParts = parts.reduce((acc, part) => acc + part.quantityReceived, 0);
  const installedParts = parts.filter((part) => part.status === "Installed").length;
  const receivedPercentage = totalParts > 0 ? Math.round((receivedParts / totalParts) * 100) : 0;
  const installedPercentage = totalParts > 0 ? Math.round((installedParts / totalParts) * 100) : 0;

  // Handle updating a part
  const handleUpdatePart = async (updatedPart: PartData) => {
    try {
      // In a real app, you would call an API to update the part
      // await fetch(`/api/partsinventory/${updatedPart.id}`, {
      //   method: 'PUT',
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
      <h1 className="text-3xl font-bold">Parts Inventory</h1>
      
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
        sectionFilter={sectionFilter}
        setSectionFilter={setSectionFilter}
        categories={categories}
        sections={sections}
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
