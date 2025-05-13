"use client";

import { useState, useEffect } from "react";
// import ScannerModal from "./components/ScannerModal";
import { FilterBar } from "./components/FilterBar";
import { MetricsCards } from "./components/MetricsCards";
import { PartsTable } from "./components/PartsTable";
// import { BarcodeScanner } from "./components/BarcodeScanner";
// import { OcrScanner } from "./components/OcrScanner";
import { PartData } from "./types";
import { getAllInventoryParts, InventoryPartWithRelations, updateInventoryPart } from "@/data/inventoryParts";
// import { useToast } from "@/components/ui/use-toast";

// Convert InventoryPart from Prisma to our PartData type
const mapInventoryPartToPartData = (part: InventoryPartWithRelations): PartData => {
  // Determine status based on quantities
  
  return {
    id: part.id.toString(),
    partNumber: part.partNumber,
    description: part.description,
    quantityExpected: part.quantityExpected,
    quantityReceived: part.quantityReceived,
    status: part.status,
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
  // const { toast } = useToast();
  const [parts, setParts] = useState<PartData[]>([]);
  const [filteredParts, setFilteredParts] = useState<PartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger] = useState(0);
  // const [scannerOpen, setScannerOpen] = useState(false);
  // const [barcodeScannerOpen, setBarcodeScannerOpen] = useState(false);
  // const [ocrScannerOpen, setOcrScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all_statuses");
  const [categoryFilter, setCategoryFilter] = useState("all_categories");
  const [boxFilter, setBoxFilter] = useState("all_boxes");
  // const [selectedPart, setSelectedPart] = useState<PartData | null>(null);
  // const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // State for filter options
  const [categories, setCategories] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  
  // State for metrics
  const [totalParts, setTotalParts] = useState(0);
  const [receivedParts, setReceivedParts] = useState(0);
  const [installedParts, setInstalledParts] = useState(0);
  const [receivedPercentage, setReceivedPercentage] = useState(0);
  const [installedPercentage, setInstalledPercentage] = useState(0);
  const [totalBoxes, setTotalBoxes] = useState(0);
  const [installedBoxes, setInstalledBoxes] = useState(0);
  const [boxesInstalledPercentage, setBoxesInstalledPercentage] = useState(0);

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
  
  // Handle form submission from scanner
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const onSubmit = async (data: any) => {
  //   console.log("Form submitted:", data);
  //   setScannerOpen(false);
  //   setRefreshTrigger(prev => prev + 1);
  // };
  
  // Handle barcode scan results
  // const handleBarcodeScan = async (barcode: string) => {
  //   console.log("Barcode scanned:", barcode);
  //   toast({
  //     title: "Barcode Scanned Successfully",
  //     description: `Barcode ${barcode} identified successfully`,
  //     variant: "success",
  //   });
  //   // Search for the part with the scanned barcode
  //   const matchingPart = parts.find(
  //     part => part.partNumber === barcode
  //   );
    
  //   if (matchingPart) {
  //     // If part is found, you can perform an action like marking it as received
  //     const updatedPart = {
  //       ...matchingPart,
  //       status: "Received",
  //       quantityReceived: matchingPart.quantityExpected
  //     };
      
  //     // Update the part
  //     await handleUpdatePart(updatedPart);
      
  //     // Show a success notification
    
  //   } else {
  //     // Part not found - you could open the add inventory form with the barcode pre-filled
  //     toast({
  //       title: "Barcode Not Found",
  //       description: `Part with barcode ${barcode} not found.`,
  //       variant: "destructive",
  //     });
  //     setScannerOpen(true);
  //   }
  // };
  
  // Handle OCR scan results - uses the same logic as barcode scanning
  // const handleOcrScan = async (partNumber: string) => {
  //   console.log("OCR scanned part number:", partNumber);
  //   toast({
  //     title: "Part Number Recognized",
  //     description: `Part number ${partNumber} identified successfully`,
  //     variant: "success",
  //   });
  //   // Search for the part with the scanned part number
  //   const matchingPart = parts.find(
  //     part => part.partNumber === partNumber
  //   );
    
  //   if (matchingPart) {
  //     // If part is found, you can perform an action like marking it as received
  //     const updatedPart = {
  //       ...matchingPart,
  //       status: "Received",
  //       quantityReceived: matchingPart.quantityExpected
  //     };
      
  //     // Update the part
  //     await handleUpdatePart(updatedPart);
      
  //   } else {
  //     // Part not found - you could open the add inventory form with the part number pre-filled
  //     toast({
  //       title: "Part Number Not Found",
  //       description: `Part with number ${partNumber} not found.`,
  //       variant: "destructive",
  //     });
  //     setScannerOpen(true);
  //   }
  // };

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

  // Function to update metrics based on current parts data
  const updateMetrics = () => {
    // Calculate metrics
    const total = parts.reduce((acc, part) => acc + part.quantityExpected, 0);
    const received = parts.reduce((acc, part) => acc + part.quantityReceived, 0);
    const installed = parts.filter((part) => part.status === "Installed").length;
    
    // Calculate box metrics
    const uniqueBoxNumbers = Array.from(new Set(parts.filter(part => part.boxNumber).map(part => part.boxNumber)));
    const totalBoxCount = uniqueBoxNumbers.length;
    
    // A box is considered installed if all its parts are installed
    const boxInstallationStatus = uniqueBoxNumbers.map(boxNumber => {
      const boxParts = parts.filter(part => part.boxNumber === boxNumber);
      const allPartsInstalled = boxParts.every(part => part.status === "Installed");
      return { boxNumber, installed: allPartsInstalled };
    });
    
    const installedBoxCount = boxInstallationStatus.filter(box => box.installed).length;
    
    setTotalParts(total);
    setReceivedParts(received);
    setInstalledParts(installed);
    setTotalBoxes(totalBoxCount);
    setInstalledBoxes(installedBoxCount);
    setReceivedPercentage(total > 0 ? Math.round((received / total) * 100) : 0);
    setInstalledPercentage(
      parts.length > 0 ? Math.round((installed / parts.length) * 100) : 0
    );
    setBoxesInstalledPercentage(
      totalBoxCount > 0 ? Math.round((installedBoxCount / totalBoxCount) * 100) : 0
    );
  };

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

    // Update metrics when parts change
    updateMetrics();
  }, [parts]);

  // Handle updating a part
  const handleUpdatePart = async (updatedPart: PartData) => {
    try {
      // Update the part in the database
      await updateInventoryPart(updatedPart.id, {
        quantityReceived: updatedPart.quantityReceived,
        status: updatedPart.status
      });
      
      // Update the local state with the updated part
      // This is similar to how the transactions table handles updates
      setParts((prevParts) => {
        // Create a new array with the updated part
        return prevParts.map((part) => 
          part.id === updatedPart.id ? updatedPart : part
        );
      });
      
      // Update the filtered parts array with the updated part
      // This ensures the table shows the updated data without a full re-render
      setFilteredParts((prevFilteredParts) => {
        // Only update the specific part in the filtered array
        return prevFilteredParts.map((part) => 
          part.id === updatedPart.id ? updatedPart : part
        );
      });
      
      // Update metrics after state updates
      updateMetrics();
    } catch (error) {
      console.error("Error updating part:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Parts Inventory</h1>
        {/* <div className="flex flex-col sm:flex-row gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow w-full sm:w-auto"
            onClick={() => setScannerOpen(true)}
          >
            Add Inventory
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow w-full sm:w-auto flex items-center justify-center gap-2"
            onClick={() => setBarcodeScannerOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="7" y1="8" x2="7" y2="16" />
              <line x1="11" y1="8" x2="11" y2="16" />
              <line x1="15" y1="8" x2="15" y2="16" />
              <line x1="19" y1="8" x2="19" y2="16" />
            </svg>
            Scan Barcode
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded shadow w-full sm:w-auto flex items-center justify-center gap-2"
            onClick={() => setOcrScannerOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 8h.01"></path>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M9 3v18"></path>
              <path d="M9 6h6"></path>
              <path d="M9 12h6"></path>
              <path d="M9 18h6"></path>
            </svg>
            Scan Text
          </button>
        </div> */}
      </div>
      {/* <ScannerModal open={scannerOpen} onClose={() => setScannerOpen(false)} onSubmit={onSubmit} /> */}
      {/* <BarcodeScanner 
        open={barcodeScannerOpen} 
        onClose={() => setBarcodeScannerOpen(false)} 
        onScan={handleBarcodeScan} 
      />
      <OcrScanner
        open={ocrScannerOpen}
        onClose={() => setOcrScannerOpen(false)}
        onScan={handleOcrScan}
      /> */}
      
      <div className="overflow-hidden">
        <MetricsCards
          totalParts={totalParts}
          receivedParts={receivedParts}
          installedParts={installedParts}
          receivedPercentage={receivedPercentage}
          installedPercentage={installedPercentage}
          totalBoxes={totalBoxes}
          installedBoxes={installedBoxes}
          boxesInstalledPercentage={boxesInstalledPercentage}
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
