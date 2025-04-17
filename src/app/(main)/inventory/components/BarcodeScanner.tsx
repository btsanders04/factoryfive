"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, FlipHorizontal, AlertCircle, CheckCircle2 } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ open, onClose, onScan }: BarcodeScannerProps): React.ReactElement {
  const [scanning, setScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [error, setError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "barcode-scanner";
  
  // Clean up any non-numeric characters from the barcode and validate format
  const cleanAndValidateBarcode = (code: string): string | null => {
    // Remove any non-numeric characters
    const cleaned = code.replace(/[^0-9]/g, "");
    
    // Check if it's a valid part number (5 digits or less)
    if (cleaned.length > 0 && cleaned.length <= 5) {
      return cleaned;
    }
    
    // Not a valid part number format
    return null;
  };

  // Handle successful scan
  const onScanSuccess = (decodedText: string) => {
    console.log("Scan success:", decodedText);

    // Clean and validate the barcode
    const validBarcode = cleanAndValidateBarcode(decodedText);
    
    if (validBarcode) {
      setScanSuccess(true);
      setScannedCode(validBarcode);
      
      // Stop the scanner
      stopScanner();
      
      // Call the onScan callback with the cleaned barcode
      onScan(validBarcode);
      
      // Close the dialog after a short delay
      setTimeout(() => {
        onClose();
        setScanSuccess(false);
        setScannedCode(null);
      }, 1500);
    } else {
      // Invalid barcode format - show error but continue scanning
      setError("Invalid part number format. Please scan a valid barcode.");
      // Clear error after 2 seconds
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  // Handle scan errors
  const onScanError = (errorMessage: string) => {
    // Don't display errors for every frame - only display errors that might require user action
    console.error("Scan error:", errorMessage);
    
    if (errorMessage.includes("access") || errorMessage.includes("permission")) {
      setError("Camera access denied. Please check permissions.");
    }
  };

  // Start the scanner
  const startScanner = async () => {
    try {
      // Clear previous errors
      setError(null);
      
      // Initialize the scanner if it doesn't exist
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }
      
      const scanner = scannerRef.current;
      
      // Configure for different barcode formats - prioritize 1D formats for part numbers
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 100 }, // More rectangular for 1D barcodes
        aspectRatio: 1.33, // 4:3 aspect ratio
        formatsToSupport: [
          // Prioritize 1D formats that are likely to be used for part numbers
          2, // EAN_13
          3, // EAN_8
          4, // CODE_39
          5, // CODE_93
          6, // CODE_128
          7, // ITF
          // Also support QR and Data Matrix as fallbacks
          0, // QR_CODE
          1  // DATA_MATRIX
        ]
      };
      
      // Start the camera with the selected facing mode
      await scanner.start(
        { facingMode },
        config,
        onScanSuccess,
        onScanError
      );
      
      setScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      setError(`Error initializing scanner: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setScanning(false);
    }
  };

  // Stop the scanner
  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        scannerRef.current.stop();
        setScanning(false);
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };

  // Toggle between front and back camera
  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    
    // Restart scanner with new facing mode
    if (scanning) {
      stopScanner();
      // Small delay to ensure clean restart
      setTimeout(() => {
        startScanner();
      }, 300);
    }
  };

  // Start scanner when dialog opens
  useEffect(() => {
    if (open) {
      startScanner();
    } else {
      stopScanner();
    }
    
    // Clean up on unmount
    return () => {
      stopScanner();
    };
  }, [open, facingMode]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Part Number</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          {/* Scanner Container */}
          <div 
            id={scannerContainerId}
            className="w-full h-64 overflow-hidden relative bg-gray-100 rounded-md"
          >
            {/* Show when scanner is not active */}
            {!scanning && !error && !scanSuccess && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-16 w-16 text-gray-400" />
              </div>
            )}
            
            {/* Show when scan is successful */}
            {scanSuccess && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                <p className="text-green-700 font-medium">Part scanned successfully!</p>
                {scannedCode && <p className="text-sm text-green-600 mt-1">Part #{scannedCode}</p>}
              </div>
            )}
            
            {/* Show when there's an error */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 z-10">
                <AlertCircle className="h-16 w-16 text-red-500 mb-2" />
                <p className="text-red-700 font-medium">Scanner Error</p>
                <p className="text-sm text-red-600 mt-1 text-center px-4">{error}</p>
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex justify-between w-full mt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            
            <div className="flex items-center gap-2">
              {error && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setError(null);
                    startScanner();
                  }}
                >
                  Retry
                </Button>
              )}
              
              <Button
                variant="outline" 
                onClick={toggleCamera}
                disabled={scanSuccess}
                className="flex items-center gap-2"
              >
                <FlipHorizontal className="h-4 w-4" />
                {facingMode === "user" ? "Back Camera" : "Front Camera"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
