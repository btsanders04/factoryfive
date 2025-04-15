/* eslint-disable @typescript-eslint/no-explicit-any */
export type PartStatus = "Pending" | "Received" | "Installed" | "Damaged" | "Missing" | "Not Received";

export interface PartData {
  id: string;
  part: string;
  status: PartStatus;
  section: string;
  category: string;
  quantity: number;
  quantityReceived: number;
  description?: string;
  supplier?: string;
  cost?: number;
  orderDate?: string;
  expectedDelivery?: string;
  receivedDate?: string;
  installedDate?: string;
  notes?: string;
  location?: string;
  inspectionNotes?: string;
  dependencies?: string[];
  isOptional?: boolean;
  estimatedInstallTime?: string;
  installDifficulty?: string;
  manualPageReference?: string;
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
  setSectionFilter: (section: string) => void;
  categories: string[];
  sections: string[];
  searchQuery?: string;
  categoryFilter?: string;
  sectionFilter?: string;
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