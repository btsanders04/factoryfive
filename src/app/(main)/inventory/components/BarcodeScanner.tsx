"use client";

import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
// Import the library directly - no dynamic imports
import { Html5QrcodeScanner } from "html5-qrcode";

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ open, onClose, onScan }: BarcodeScannerProps): React.ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);
  
  // Use a ref to store the scanner instance
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  
  // Scanner container ID - must be unique
  const scannerContainerId = "barcode-scanner-container";
  
  // Clean up and validate barcode - simpler approach
  const cleanAndValidateBarcode = (code: string): string | null => {
    console.log("Raw barcode scan:", code);
    
    // For iOS, we keep it simple - extract any digits and take up to 5
    const digits = code.replace(/[^0-9]/g, "");
    
    if (digits.length > 0) {
      const result = digits.substring(0, Math.min(5, digits.length));
      console.log("Extracted part number:", result);
      return result;
    }
    
    return null;
  };

  // Handle successful scan
  const onScanSuccess = (decodedText: string) => {
    console.log(`Code matched = ${decodedText}`);
    
    // Clean and validate the barcode
    const validBarcode = cleanAndValidateBarcode(decodedText);
    
    if (validBarcode) {
      // Show success UI
      setScanSuccess(true);
      setScannedCode(validBarcode);
      
      // Call the callback with the result
      onScan(validBarcode);
      
      // Close after a delay
      setTimeout(() => {
        onClose();
        setScanSuccess(false);
        setScannedCode(null);
      }, 1500);
    }
  };

  // Handle scan failure
  const onScanFailure = (error: string) => {
    // Just log errors, don't display to user unless critical
    console.warn(`Code scan error = ${error}`);
    
    if (error && typeof error === 'string' && 
        (error.includes('Camera access') || error.includes('permission'))) {
      setError("Camera access denied. Please check permissions.");
    }
  };

  // Initialize scanner when dialog opens
  useEffect(() => {
    // Only initialize when dialog is open and in the browser
    if (open && typeof window !== 'undefined') {
      setInitializing(true);
      setError(null);
      
      try {
        // Clear any existing scanner
        const container = document.getElementById(scannerContainerId);
        if (container) {
          container.innerHTML = '';
        }
        
        // Create a new scanner with basic config from docs
        setTimeout(() => {
          try {
            // Create the scanner with simple configuration
            const scanner = new Html5QrcodeScanner(
              scannerContainerId,
              { 
                fps: 10, 
                qrbox: {width: 250, height: 100}, // Wider for Code 128 barcodes
                formatsToSupport: [0, 1, 2, 3, 4, 5, 6, 7], // Support common barcode formats
                rememberLastUsedCamera: true,
                showTorchButtonIfSupported: true,
              },
              false // verbose mode off
            );
            
            // Store scanner in ref
            scannerRef.current = scanner;
            
            // Render the scanner UI
            scanner.render(onScanSuccess, onScanFailure);
            
            setInitializing(false);
          } catch (err) {
            console.error("Error creating scanner:", err);
            setError(`Camera error: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setInitializing(false);
          }
        }, 1000); // Delay to ensure DOM is ready
      } catch (err) {
        console.error("Scanner initialization error:", err);
        setError(`Camera error: ${err instanceof Error ? err.message : 'Please check camera permissions'}`);
        setInitializing(false);
      }
    }
    
    // Clean up when dialog closes
    return () => {
      try {
        if (scannerRef.current) {
          scannerRef.current.clear();
          scannerRef.current = null;
        }
      } catch (err) {
        console.error("Error cleaning up scanner:", err);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Part Number</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          {/* Scanner Container - Html5QrcodeScanner will render its UI here */}
          <div className="w-full relative">
            {/* The scanner will render inside this div */}
            <div id={scannerContainerId} className="w-full"></div>
            
            {/* Show when scanner is initializing */}
            {initializing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50 z-20">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-2" />
                <p className="text-blue-700 font-medium">Starting camera...</p>
              </div>
            )}
            
            {/* Show when scan is successful */}
            {scanSuccess && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50 z-20">
                <CheckCircle2 className="h-20 w-20 text-green-500 mb-3" />
                <p className="text-green-700 font-medium text-xl">SCAN SUCCESSFUL!</p>
                {scannedCode && (
                  <div className="mt-3 text-center">
                    <p className="text-gray-700 text-sm">Part Number:</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{scannedCode}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Show when there's an error */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 z-10">
                <AlertCircle className="h-16 w-16 text-red-500 mb-2" />
                <p className="text-red-700 font-medium">Camera Error</p>
                <p className="text-sm text-red-600 mt-1 text-center px-4">{error}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setError(null);
                    // Try to reinitialize the scanner
                    if (scannerRef.current) {
                      try {
                        scannerRef.current.clear();
                        scannerRef.current = null;
                        
                        // Force a small delay then try again
                        setInitializing(true);
                        setTimeout(() => {
                          const container = document.getElementById(scannerContainerId);
                          if (container) container.innerHTML = '';
                          
                          const scanner = new Html5QrcodeScanner(
                            scannerContainerId,
                            { 
                              fps: 10, 
                              qrbox: {width: 250, height: 100},
                              formatsToSupport: [0, 1, 2, 3, 4, 5, 6, 7],
                              rememberLastUsedCamera: true,
                            },
                            false
                          );
                          
                          scannerRef.current = scanner;
                          scanner.render(onScanSuccess, onScanFailure);
                          setInitializing(false);
                        }, 1000);
                      } catch (err) {
                        console.error("Error reinitializing scanner:", err);
                        setError(`Failed to restart camera: ${err instanceof Error ? err.message : 'Unknown error'}`);
                        setInitializing(false);
                      }
                    }
                  }}
                  className="mt-4"
                >
                  Try Again
                </Button>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
