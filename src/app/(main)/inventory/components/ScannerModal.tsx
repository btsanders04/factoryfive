import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CameraIcon, XIcon, ImageIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScannerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BoxData[]) => void;
}

interface ResultData {
  results: BoxData[];
  successful: number;
  processed: number;
}


export interface BoxData {
  box_number?: string;
  categories?: Array<{
    category_name?: string;
    category_number?: string;
    parts?: Array<{
      part_number?: string;
      description?: string;
      quantity?: number;
    }>;
  }>;
}

export default function ScannerModal({ open, onClose, onSubmit }: ScannerModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [ocrText, setOcrText] = useState<string>('');
  const [parsedData, setParsedData] = useState<BoxData[] | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      const imageUrls = fileArray.map(file => URL.createObjectURL(file));
      
      setImages(imageUrls);
      setSelectedFiles(fileArray);
      
      // Reset previous results when new files are selected
      setOcrText('');
      setError('');
      setParsedData(null);
    }
  };

  const processImages = async () => {
    if (selectedFiles.length === 0) return;
    
    setLoading(true);
    setError('');
    setOcrText('');
    setParsedData(null);
    
    try {
      // Send images to Claude API endpoint
      const formData = new FormData();
      
      // Append all files to the form data
      selectedFiles.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });
      
      const response = await fetch('/api/claude-parse', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to parse images with Claude API');
      }
      
      const json = await response.json() as ResultData;
      setOcrText(JSON.stringify(json, null, 2));
      setParsedData(json.results);
      console.log(json);
    } catch (err) {
      setError('Failed to process images with Claude API: ' + err);
    } finally {
      setLoading(false);
    }
  };

  // Function to reset all state when the modal is closed
  const handleClose = () => {
    // Clear all data
    setSelectedFiles([]);
    setLoading(false);
    setError('');
    setOcrText('');
    setParsedData(null);
    
    // Call the parent's onClose function
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Inventory Scanner</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-grow pr-2 space-y-4" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {!parsedData && (
            <>
              <div className="flex flex-col items-center justify-center space-y-4 mb-4">
                <div className="flex items-center justify-center w-full gap-3">
                  <input
                    id="scanner-upload"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple={true}
                    onChange={handleImageChange}
                    className="hidden"
                    ref={(input) => {
                      // This is a workaround for the ref type
                      const fileInput = input as HTMLInputElement | null;
                      if (fileInput) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).fileInput = fileInput;
                      }
                    }}
                  />
                  <Button 
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const fileInput = (window as any).fileInput;
                      if (fileInput) fileInput.click();
                    }}
                    className="flex-1 py-6 flex flex-col items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-2 border-dashed border-primary/30 rounded-lg"
                    variant="ghost"
                    type="button"
                  >
                    <CameraIcon className="h-8 w-8" />
                    <span className="text-sm font-medium">Take Photo</span>
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const fileInput = (window as any).fileInput;
                      if (fileInput) {
                        fileInput.removeAttribute('capture');
                        fileInput.click();
                        // Reset capture attribute after click
                        setTimeout(() => {
                          fileInput.setAttribute('capture', 'environment');
                        }, 100);
                      }
                    }}
                    className="flex-1 py-6 flex flex-col items-center justify-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border-2 border-dashed border-secondary/30 rounded-lg"
                    variant="ghost"
                    type="button"
                  >
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-sm font-medium">Choose Files</span>
                  </Button>
                </div>
                
                {images.length > 0 && (
                  <div className="text-sm text-center text-muted-foreground">
                    {images.length} {images.length === 1 ? 'image' : 'images'} selected
                  </div>
                )}
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Captured ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-border"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const newImages = [...images];
                          newImages.splice(index, 1);
                          setImages(newImages);
                          
                          const newFiles = [...selectedFiles];
                          newFiles.splice(index, 1);
                          setSelectedFiles(newFiles);
                        }}
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          
          {loading && (
            <div className="text-center text-sm text-muted-foreground">Processing image...</div>
          )}
          
          {error && (
            <div className="text-center text-sm text-destructive font-medium">{error}</div>
          )}
          
          {parsedData && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Extracted Data:</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setParsedData([]);
                    setOcrText('');
                  }}
                  className="text-xs"
                >
                  Reset & Upload New
                </Button>
              </div>
              <Tabs defaultValue="structured" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="structured">Structured View</TabsTrigger>
                  <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                </TabsList>
                
                <TabsContent value="structured" className="mt-2">
                  <Accordion type="single" collapsible className="w-full">
                    {parsedData.map((box: BoxData, boxIndex: number) => (
                      <AccordionItem key={boxIndex} value={`box-${boxIndex}`}>
                        <AccordionTrigger className="hover:bg-accent/50 px-3 rounded-md">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              Box {box.box_number || `#${boxIndex + 1}`}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {box.categories?.reduce((total, category) => total + (category.parts?.length || 0), 0) || 0} parts
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {box.categories?.map((category, categoryIndex) => (
                            <Card key={categoryIndex} className="mb-3 border-border bg-card">
                              <CardHeader className="py-3 px-4">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                  {category.category_number && (
                                    <Badge variant="secondary" className="font-mono text-xs">
                                      {category.category_number}
                                    </Badge>
                                  )}
                                  {category.category_name || `Category ${categoryIndex + 1}`}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  {category.parts?.length || 0} parts in this category
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="py-0 px-0">
                                <div className="max-h-[200px] overflow-y-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-[100px]">Part #</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right w-[80px]">Qty</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {category.parts?.map((part, partIndex) => (
                                        <TableRow key={partIndex}>
                                          <TableCell className="font-mono text-xs">
                                            {part.part_number || '—'}
                                          </TableCell>
                                          <TableCell>{part.description || '—'}</TableCell>
                                          <TableCell className="text-right">
                                            {part.quantity !== undefined ? part.quantity : '—'}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="raw" className="mt-2">
                  <pre className="bg-muted/30 p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap text-foreground max-h-[300px] overflow-y-auto">
                    {ocrText}
                  </pre>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-4">
          <div className="w-full sm:w-auto">
            {selectedFiles.length > 0 && !loading && !parsedData && (
              <Button 
                onClick={processImages} 
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
                size="lg"
              >
                Analyze {selectedFiles.length > 1 ? `(${selectedFiles.length} files)` : ''}
              </Button>
            )}
            {parsedData && (
              <Button 
                onClick={async () => {
                  try {
                    setLoading(true);
                    const response = await fetch('/api/inventory', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(parsedData)
                    });
                    
                    if (!response.ok) {
                      throw new Error('Failed to save inventory data');
                    }
                    
                    const result = await response.json();
                    console.log('Inventory saved:', result);
                    onSubmit(parsedData);
                    
                    // Close the modal on success
                    handleClose();
                  } catch (err) {
                    setError(`Failed to save inventory: ${err}`);
                  } finally {
                    setLoading(false);
                  }
                }} 
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
                size="lg"
              >
                Save to Inventory
              </Button>
            )}
          </div>
          <Button 
            variant="outline" 
            onClick={handleClose} 
            className="w-full sm:w-auto border-border hover:bg-accent hover:text-accent-foreground"
            size="lg"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
