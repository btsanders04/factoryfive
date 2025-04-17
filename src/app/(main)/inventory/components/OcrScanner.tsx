"use client";

import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2, Camera } from "lucide-react";
import { createWorker } from 'tesseract.js';

// Add type definitions for missing MediaTrack capabilities
declare global {
  interface MediaTrackCapabilities {
    torch?: boolean;
  }
  
  interface MediaTrackConstraintSet {
    torch?: boolean;
  }
}

interface OcrScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (partNumber: string) => void;
}

export function OcrScanner({ open, onClose, onScan }: OcrScannerProps): React.ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  
  // Refs for video and canvas elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Clean up and validate part number - extract 5 digits
  const extractPartNumber = (text: string): string | null => {
    console.log("Raw OCR text:", text);
    
    // Look for 5 consecutive digits
    const match = text.match(/\b\d{5}\b/);
    if (match) {
      return match[0];
    }
    
    // If no 5-digit match, extract any digits and take up to 5
    const digits = text.replace(/[^0-9]/g, "");
    
    if (digits.length > 0) {
      const result = digits.substring(0, Math.min(5, digits.length));
      console.log("Extracted part number:", result);
      return result;
    }
    
    return null;
  };

  // Initialize camera when dialog opens
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const initCamera = async () => {
      setInitializing(true);
      setError(null);
      
      try {
        // Request camera access with back camera preference
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Prefer back camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        // Store stream in ref for cleanup
        streamRef.current = stream;
        
        // Connect stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true);
            setInitializing(false);
          };
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError(`Camera error: ${err instanceof Error ? err.message : 'Please check camera permissions'}`);
        setInitializing(false);
      }
    };
    
    // Start camera when dialog opens
    if (open && typeof window !== 'undefined') {
      initCamera();
    }
    
    // Clean up when dialog closes
    return () => {
      // Stop all video tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Reset states
      setCameraReady(false);
      setTorchEnabled(false);
    };
  }, [open]);
  
  // Function to toggle flashlight/torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    
    try {
      const track = streamRef.current.getVideoTracks()[0];
      if (!track) return;
      
      // Check if torch is supported
      const capabilities = track.getCapabilities();
      if (!capabilities.torch) {
        console.log("Torch not supported on this device");
        return;
      }
      
      // Toggle torch
      const newTorchState = !torchEnabled;
      await track.applyConstraints({
        advanced: [{ torch: newTorchState }]
      });
      
      setTorchEnabled(newTorchState);
    } catch (err) {
      console.error("Error toggling torch:", err);
    }
  };
  
  // Function to capture image and process with OCR
  const captureAndProcess = async () => {
    if (!videoRef.current || !canvasRef.current || processing) return;
    
    setProcessing(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data as base64
      const imageData = canvas.toDataURL('image/jpeg');
      
      // Process with Tesseract
      const worker = await createWorker();
      // Cast worker to any to avoid TypeScript errors with the Tesseract.js API
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tesseractWorker = worker as any;
      await tesseractWorker.loadLanguage('eng');
      await tesseractWorker.initialize('eng');
      
      // Configure for digits recognition
      await tesseractWorker.setParameters({
        tessedit_char_whitelist: '0123456789',
      });
      
      const { data } = await tesseractWorker.recognize(imageData);
      await tesseractWorker.terminate();
      
      console.log("OCR Result:", data.text);
      
      // Extract part number from OCR text
      const partNumber = extractPartNumber(data.text);
      
      if (partNumber) {
        // Show success UI
        setScanSuccess(true);
        setScannedCode(partNumber);
        
        // Call the callback with the result
        onScan(partNumber);
        
        // Close after a delay
        setTimeout(() => {
          onClose();
          setScanSuccess(false);
          setScannedCode(null);
        }, 1500);
      } else {
        setError("No part number found. Please try again.");
        setTimeout(() => setError(null), 2000);
      }
    } catch (err) {
      console.error("OCR processing error:", err);
      setError(`Processing error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Part Number with OCR</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          <div className="w-full relative">
            {/* Video element for camera feed */}
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto rounded-lg"
              style={{ display: cameraReady ? 'block' : 'none' }}
            />
            
            {/* Canvas for image processing (hidden) */}
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Overlay with targeting guide */}
            {cameraReady && !processing && !scanSuccess && !error && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-dashed border-yellow-400 w-3/4 h-1/3 flex items-center justify-center">
                  <p className="text-yellow-400 text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                    Align 5-digit part number here
                  </p>
                </div>
              </div>
            )}
            
            {/* Show when camera is initializing */}
            {initializing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50 z-20">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-2" />
                <p className="text-blue-700 font-medium">Starting camera...</p>
              </div>
            )}
            
            {/* Show when processing OCR */}
            {processing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50 z-20">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-2" />
                <p className="text-blue-700 font-medium">Processing image...</p>
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
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-sm text-red-600 mt-1 text-center px-4">{error}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setError(null)}
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
          
          {/* Camera controls */}
          {cameraReady && !processing && !scanSuccess && !error && (
            <div className="flex justify-center gap-4 mt-4">
              {/* Torch/flashlight toggle button */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTorch}
                className={`${torchEnabled ? 'bg-yellow-100 text-yellow-800' : ''}`}
              >
                {torchEnabled ? 'Torch On' : 'Torch Off'}
              </Button>
              
              {/* Capture button */}
              <Button
                variant="default"
                size="lg"
                onClick={captureAndProcess}
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="mr-2 h-5 w-5" />
                Capture
              </Button>
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-4 text-center">
            Point camera at the 5-digit part number on the box and tap Capture
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
