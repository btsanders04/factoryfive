"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {FlipHorizontal } from "lucide-react";

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
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  
  // Start the camera when the dialog opens
  useEffect(() => {
    let stream: MediaStream | null = null;
    let quaggaInitialized = false;
    
    async function startCamera() {
      try {
        if (!open) return;
        
        setScanning(true);
        setError(null);
        
        // Add a longer delay for mobile devices to initialize properly
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Request camera access with high-quality constraints for better barcode detection
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            // Use more moderate resolution to prevent pulsating/flickering
            width: { min: 640, ideal: 1024, max: 1280 },
            height: { min: 480, ideal: 720, max: 960 },
            // Add constraints to stabilize the camera and prevent pulsating
            frameRate: { ideal: 30 },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(typeof window !== 'undefined' ? { zoom: 1 } as any : {})
          },
          audio: false
        });
        
        // Set the video source to the camera stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Use the play() promise to ensure video is ready
          try {
            await videoRef.current.play();
            // Wait longer for the video to fully initialize and stabilize
            await new Promise(resolve => setTimeout(resolve, 800));
            await scanBarcode();
            quaggaInitialized = true;
          } catch (playError) {
            console.error("Error playing video:", playError);
            setError("Could not start video stream. Please try again.");
            setScanning(false);
          }
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
      // First stop Quagga if it was initialized
      if (quaggaInitialized) {
        try {
          // Use dynamic import to avoid issues with SSR
          import('@ericblade/quagga2').then(({ default: Quagga }) => {
            Quagga.stop();
          }).catch(err => {
            console.error("Error stopping Quagga:", err);
          });
        } catch (err) {
          console.error("Error during Quagga cleanup:", err);
        }
      }
      
      // Then stop all media tracks
      if (stream) {
        try {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        } catch (err) {
          console.error("Error stopping media tracks:", err);
        }
      }
      
      // Clear video source
      if (videoRef.current && videoRef.current.srcObject) {
        try {
          videoRef.current.srcObject = null;
        } catch (err) {
          console.error("Error clearing video source:", err);
        }
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
      
      // Check if video element exists and is ready
      if (!videoRef.current) {
        setError("Camera element not found");
        return;
      }
      
      // Make sure the video is actually playing and has dimensions
      if (videoRef.current && (
          videoRef.current.readyState === 0 || 
          !videoRef.current.videoWidth || 
          !videoRef.current.videoHeight)) {
        console.log("Video not ready yet, waiting...");
        // Wait for video to be ready
        await new Promise<boolean>((resolve) => {
          const checkVideo = () => {
            if (videoRef.current && 
                videoRef.current.readyState > 0 && 
                videoRef.current.videoWidth > 0 && 
                videoRef.current.videoHeight > 0) {
              resolve(true);
            } else if (open && scanning) {
              setTimeout(checkVideo, 100);
            } else {
              resolve(false);
            }
          };
          checkVideo();
        });
      }
      
      // Add a small delay before initializing Quagga to allow camera to stabilize
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Initialize barcode scanner with optimized settings for small, dense barcodes
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current,
          constraints: {
            facingMode: facingMode,
            // Higher resolution for better barcode detection
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 }
          },
          area: {
            // Focus on the center 70% of the video for better detection and stability
            top: "15%",
            right: "15%",
            left: "15%",
            bottom: "15%"
          },
        },
        locator: {
          // Use medium patch size for better stability while still detecting small barcodes
          patchSize: "medium",
          // Enable half sample to reduce processing and stabilize the feed
          halfSample: true,
          debug: {
            showCanvas: false,
            showPatches: false,
            showFoundPatches: false,
            showSkeleton: false,
            showLabels: false,
            showPatchLabels: false,
            showRemainingPatchLabels: false
          }
        },
        // Use more workers for better performance on modern devices
        numOfWorkers: 4,
        decoder: {
          readers: [
            // Prioritize readers that work well with printed numbers and small barcodes
            "code_128_reader",
            "code_39_reader",
            "code_39_vin_reader", // Added for better detection of alphanumeric codes
            "i2of5_reader",
            "2of5_reader",
            "code_93_reader",
            // Include other readers with lower priority
            "ean_reader",
            "ean_8_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader"
          ],
          multiple: false,
          // Add decoder settings for better detection
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true
          }
        },
        locate: true,
        frequency: 6, // Moderate scan frequency to reduce flickering while maintaining detection
        debug: false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, (err: any) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
          setError("Error initializing barcode scanner: " + (err.message || 'Unknown error'));
          // Clean up resources even if there's an error
          try {
            if (videoRef.current && videoRef.current.srcObject) {
              const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
              tracks.forEach(track => track.stop());
              videoRef.current.srcObject = null;
            }
          } catch (cleanupErr) {
            console.error("Error during cleanup:", cleanupErr);
          }
          return;
        }
        
        // Start scanning
        Quagga.start();
        
        // Listen for barcode detection
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Quagga.onDetected((result: any) => {
          if (result && result.codeResult) {
            let code = result.codeResult.code;
            console.log("Barcode detected:", code, "with format:", result.codeResult.format, "and confidence:", result.codeResult.confidence);
            
            // Process the code - handle numeric part numbers specifically
            if (code) {
              // Clean up the code - remove any non-alphanumeric characters
              code = code.replace(/[^a-zA-Z0-9]/g, '');
              
              // If it's a numeric code (like 10577 or 10602), ensure it's valid
              if (/^\d+$/.test(code)) {
                // For numeric codes, only accept if they're in a reasonable range for part numbers
                // and have a minimum confidence level - lower threshold for mobile
                // Check if app is in standalone mode (iOS Safari) or installed as PWA
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const isStandalone = (window.navigator as any).standalone || 
                  window.matchMedia('(display-mode: standalone)').matches;
                // Lower confidence threshold to detect small, dense barcodes
                const confidenceThreshold = isStandalone ? 0.4 : 0.5;
                
                if (code.length >= 4 && code.length <= 10 && result.codeResult.confidence > confidenceThreshold) {
                  console.log("Numeric part number detected:", code);
                } else {
                  // If confidence is too low, continue scanning
                  console.log("Low confidence numeric code, continuing scan...");
                  return;
                }
              }
            } else {
              // No code detected, continue scanning
              return;
            }
            
            // Stop scanning but don't close the dialog yet
            Quagga.stop();
            setScannedCode(code);
            setScanSuccess(true);
            
            // Call onScan to process the barcode
            onScan(code);
            
            // Close the dialog after a short delay so the user can see the result
            setTimeout(() => {
              onClose();
              // Reset the state after closing
              setTimeout(() => {
                setScannedCode(null);
                setScanSuccess(false);
              }, 300);
            }, 1500);
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
        </DialogHeader>
        
        <div className="relative aspect-video bg-black rounded-md overflow-hidden">
          {/* Add focus guide overlay to help users position barcodes */}
          {!scanSuccess && !error && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="border-2 border-white/40 rounded-md w-4/5 h-3/5 flex items-center justify-center">
                <div className="text-white/60 text-xs">Center barcode here</div>
              </div>
            </div>
          )}
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-red-900/50 p-4 text-center">
              {error}
            </div>
          ) : scanSuccess && scannedCode ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-green-900/70 p-4 text-center">
              <div className="text-2xl font-bold mb-2">✓ Barcode Detected!</div>
              <div className="text-xl">{scannedCode}</div>
            </div>
          ) : null}
          
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${scanSuccess ? 'opacity-50' : ''}`} 
            playsInline 
            muted
            style={{ transform: 'translateZ(0)', willChange: 'transform' }} // Hardware acceleration to reduce flickering
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
          {scanSuccess && scannedCode 
            ? `Successfully scanned barcode: ${scannedCode}` 
            : (
              <>
                <p>Position the barcode within the frame and hold steady.</p>
                <p className="mt-1">For small barcodes, position camera 3-6 inches away in good lighting.</p>
              </>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
