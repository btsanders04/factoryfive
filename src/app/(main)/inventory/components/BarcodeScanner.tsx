"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, FlipHorizontal, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

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
  const [initializing, setInitializing] = useState(false);
  
  // Use a string ID instead of a ref for html5-qrcode
  const scannerContainerId = "barcode-scanner";
  
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

  // We've moved the success handling directly into the startScanner method
  // for better iOS compatibility

  // Start the scanner - completely rewritten for iOS compatibility
  const startScanner = async () => {
    try {
      setInitializing(true);
      setError(null);
      
      // Always create a new instance for iOS
      let html5QrCode = new Html5Qrcode(scannerContainerId);
      
      // Simple configuration that works better on iOS
      const config = {
        fps: 10,
        qrbox: 250,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_13
        ]
      };
      
      console.log("Starting camera with facing mode:", facingMode);
      
      await html5QrCode.start(
        { facingMode }, 
        config,
        (decodedText) => {
          // Success callback
          console.log("Scan result:", decodedText);
          const validBarcode = cleanAndValidateBarcode(decodedText);
          
          if (validBarcode) {
            setScanSuccess(true);
            setScannedCode(validBarcode);
            html5QrCode.stop();
            onScan(validBarcode);
            
            setTimeout(() => {
              onClose();
              setScanSuccess(false);
              setScannedCode(null);
            }, 1500);
          }
        },
        (errorMessage) => {
          // We'll ignore most errors as they're just frames that couldn't be scanned
          console.log("Scan error (normal):", errorMessage);
        }
      );
      
      setScanning(true);
      setInitializing(false);
    } catch (err) {
      console.error("Camera initialization error:", err);
      setError(`Camera error: ${err instanceof Error ? err.message : 'Please check camera permissions'}`);
      setScanning(false);
      setInitializing(false);
    }
  };

  // Stop the scanner - simplified for iOS
  const stopScanner = () => {
    try {
      // Try to get the current instance by ID
      const scanner = new Html5Qrcode(scannerContainerId);
      if (scanner && scanner.isScanning) {
        scanner.stop().catch(err => {
          console.error("Error stopping scanner:", err);
        });
      }
      setScanning(false);
    } catch (error) {
      console.error("Error accessing scanner:", error);
    }
  };

  // Toggle between front and back camera - simplified for iOS
  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    setError(null);
    
    // Always stop first
    stopScanner();
    
    // Delay restart for iOS to release camera resources
    setTimeout(() => {
      startScanner();
    }, 800); // Longer delay for iOS
  };

  // Start scanner when dialog opens - modified for iOS
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (open) {
      // Slight delay for mounting on iOS
      timeoutId = setTimeout(() => {
        startScanner();
      }, 300);
    } else {
      stopScanner();
    }
    
    // Clean up on unmount
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      stopScanner();
    };
  }, [open]);
  
  // Handle facingMode changes separately
  useEffect(() => {
    if (open && scanning) {
      stopScanner();
      const timeoutId = setTimeout(() => {
        startScanner();
      }, 800);
      
      return () => clearTimeout(timeoutId);
    }
  }, [facingMode]);

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
            {/* Show when scanner is initializing */}
            {initializing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50 z-20">
                <RefreshCw className="h-12 w-12 text-blue-500 mb-2 animate-spin" />
                <p className="text-blue-700 font-medium">Starting camera...</p>
              </div>
            )}
            
            {/* Show when scanner is not active */}
            {!scanning && !initializing && !error && !scanSuccess && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-16 w-16 text-gray-400" />
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
                    startScanner();
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
            
            <Button
              variant="outline" 
              onClick={toggleCamera}
              disabled={scanSuccess || initializing}
              className="flex items-center gap-2"
            >
              <FlipHorizontal className="h-4 w-4" />
              {facingMode === "user" ? "Back Camera" : "Front Camera"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
