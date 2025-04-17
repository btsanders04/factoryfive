"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {FlipHorizontal, X } from "lucide-react";

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ open, onClose, onScan }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Start the camera when the dialog opens
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    async function startCamera() {
      try {
        if (!open) return;
        
        setScanning(true);
        setError(null);
        
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false
        });
        
        // Set the video source to the camera stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          scanBarcode();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions and try again.");
        setScanning(false);
      }
    }
    
    startCamera();
    
    // Clean up when component unmounts or dialog closes
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setScanning(false);
    };
  }, [open, facingMode]);
  
  // Function to scan for barcodes
  const scanBarcode = async () => {
    if (!open || !scanning) return;
    
    try {
      // Import the barcode detection library dynamically
      const Quagga = (await import('@ericblade/quagga2')).default;
      
      // Check if video element exists
      if (!videoRef.current) {
        setError("Camera element not found");
        return;
      }
      
      // Initialize barcode scanner
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current, // Now we're sure videoRef.current is not null
          constraints: {
            facingMode: facingMode
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: 2,
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader"
          ]
        },
        locate: true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, (err: any) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
          setError("Error initializing barcode scanner.");
          return;
        }
        
        // Start scanning
        Quagga.start();
        
        // Listen for barcode detection
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Quagga.onDetected((result: any) => {
          if (result && result.codeResult) {
            const code = result.codeResult.code;
            console.log("Barcode detected:", code);
            
            // Stop scanning and close the dialog
            Quagga.stop();
            onScan(code);
            onClose();
          }
        });
      });
    } catch (err) {
      console.error("Error setting up barcode scanner:", err);
      setError("Error setting up barcode scanner. Please try again.");
    }
  };
  
  // Toggle between front and back camera
  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="relative aspect-video bg-black rounded-md overflow-hidden">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-red-900/50 p-4 text-center">
              {error}
            </div>
          ) : null}
          
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover" 
            playsInline 
            muted
          />
          
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={toggleCamera}
            >
              <FlipHorizontal className="h-4 w-4" />
              <span className="sr-only">Flip Camera</span>
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-center text-muted-foreground">
          Position the barcode within the camera view to scan automatically.
        </div>
      </DialogContent>
    </Dialog>
  );
}
