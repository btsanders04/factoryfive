/* eslint-disable @typescript-eslint/no-explicit-any */
export type PartStatus = "Not Received" | "Partial" | "Complete" | "Installed" | "Damaged" | "Missing";

export interface PartData {
  id: string;
  partNumber: string;
  description: string;
  quantityExpected: number;
  quantityReceived: number;
  status: PartStatus;
  categoryId: number;
  categoryName: string;
  categoryNumber: string;
  boxId: number;
  boxNumber: string;
  notes?: string;
  installDate?: string;
  inspectionNotes?: string;
}

export interface PartsTableProps {
  data: PartData[];
  isLoading: boolean;
  setSelectedPart: (part: PartData) => void;
  setIsDetailOpen: (open: boolean) => void;
  handleUpdatePart: (part: PartData) => void;
}

export interface FilterBarProps {
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setCategoryFilter: (category: string) => void;
  setBoxFilter: (box: string) => void;
  categories: string[];
  boxes: string[];
  searchQuery?: string;
  categoryFilter?: string;
  boxFilter?: string;
  statusFilter?: string;
  table?: any;
}

export interface MetricsCardsProps {
  totalParts: number;
  receivedParts: number;
  installedParts: number;
  receivedPercentage?: number;
  installedPercentage?: number;
}

export interface PartDetailDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  part: PartData | null;
  handleUpdatePart: (part: PartData) => void;
} 