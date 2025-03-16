/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, DifficultyBadge } from "./Badges";
import { PartData, PartStatus } from "../types";
import { usePdfViewer } from "@/components/PdfViewerContext";
import { BookOpen } from "lucide-react";

interface PartDetailDialogProps {
  part: PartData;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onUpdate: (part: PartData) => void;
  partsData: PartData[];
  categories: string[];
  sections: string[];
}

export function PartDetailDialog({
  part,
  isOpen,
  setIsOpen,
  onUpdate,
  partsData,
  categories,
  sections,
}: PartDetailDialogProps) {
  const [editedPart, setEditedPart] = useState<PartData>({ ...part });
  const { navigateToPage } = usePdfViewer();

  const handleStatusChange = (value: PartStatus) => {
    setEditedPart({ ...editedPart, status: value });
  };

  const handleQuantityReceivedChange = (value: number) => {
    setEditedPart({ ...editedPart, quantityReceived: value });
  };

  const handleLocationChange = (value: string) => {
    setEditedPart({ ...editedPart, location: value });
  };

  const handleInspectionNotesChange = (value: string) => {
    setEditedPart({ ...editedPart, inspectionNotes: value });
  };

  const handleSave = () => {
    onUpdate(editedPart);
    setIsOpen(false);
  };

  // Get dependent parts
  const dependentParts = useMemo(() => {
    return partsData.filter((p) =>
      editedPart.dependencies?.includes(p.id)
    );
  }, [editedPart.dependencies, partsData]);

  const handleViewManualPage = () => {
    if (editedPart.manualPageReference) {
      const pageNumber = parseInt(editedPart.manualPageReference);
      if (!isNaN(pageNumber)) {
        navigateToPage(pageNumber);
        // Close the dialog after navigating
        setIsOpen(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editedPart.part}</DialogTitle>
          <DialogDescription>ID: {editedPart.id}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="installation">Installation</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium">Section</h4>
                <p className="text-sm text-gray-500">{editedPart.section}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Category</h4>
                <p className="text-sm text-gray-500">{editedPart.category}</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <h4 className="text-sm font-medium">Notes</h4>
                <p className="text-sm text-gray-500">
                  {editedPart.notes || "No notes"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Optional</h4>
                <p className="text-sm text-gray-500">
                  {editedPart.isOptional ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dependencies" className="space-y-4">
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Dependencies</h4>
              {editedPart.dependencies?.length === 0 ? (
                <p className="text-sm text-gray-500">No dependencies</p>
              ) : (
                <div className="space-y-2">
                  {dependentParts.map((depPart) => (
                    <div
                      key={depPart.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{depPart.part}</span>
                      <StatusBadge status={depPart.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium">Quantity Required</h4>
                <p className="text-sm text-gray-500">{editedPart.quantity}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Quantity Received</h4>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={editedPart.quantityReceived}
                    onChange={(e) =>
                      handleQuantityReceivedChange(parseInt(e.target.value) || 0)
                    }
                    className="w-20"
                    min={0}
                    max={editedPart.quantity}
                  />
                  <span className="text-sm text-gray-500">
                    of {editedPart.quantity}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <Select
                  value={editedPart.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Received">Not Received</SelectItem>
                    <SelectItem value="Received">Received</SelectItem>
                    <SelectItem value="Installed">Installed</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                    <SelectItem value="Missing">Missing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h4 className="text-sm font-medium">Storage Location</h4>
                <Input
                  value={editedPart.location || ""}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  placeholder="Enter storage location"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <h4 className="text-sm font-medium">Inspection Notes</h4>
                <Input
                  value={editedPart.inspectionNotes}
                  onChange={(e) => handleInspectionNotesChange(e.target.value)}
                  placeholder="Enter inspection notes"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="installation" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium">Estimated Install Time</h4>
                <p className="text-sm text-gray-500">
                  {editedPart.estimatedInstallTime}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Install Difficulty</h4>
                <div className="mt-1">
                  <DifficultyBadge
                    difficulty={editedPart.installDifficulty || ""}
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Install Date</h4>
                <p className="text-sm text-gray-500">
                  {editedPart.installedDate || "Not installed"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Manual Reference</h4>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500">
                    {editedPart.manualPageReference || "N/A"}
                  </p>
                  {editedPart.manualPageReference && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleViewManualPage}
                      className="flex items-center space-x-1"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>View Page</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 