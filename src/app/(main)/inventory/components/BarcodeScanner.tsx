"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FlipHorizontal, Text } from "lucide-react";
// Import Tesseract.js for OCR text recognition
import { createWorker } from "tesseract.js";

// Define types for Tesseract.js Worker
interface TesseractWorker {
  loadLanguage: (language: string) => Promise<void>;
  initialize: (language: string) => Promise<void>;
  setParameters: (params: { tessedit_char_whitelist?: string; tessedit_pageseg_mode?: string }) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognize: (image: string | ImageData) => Promise<any>;
  terminate: () => Promise<void>;
}


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
  const [scanMode, setScanMode] = useState<"barcode" | "text">("barcode");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  
  // Function to perform OCR text recognition
  const recognizeText = React.useCallback(async () => {
    if (!open || !scanning || !videoRef.current) return;
    
    try {
      setIsProcessingOcr(true);
      
      // Create a canvas to capture the current video frame
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx || !videoRef.current) {
        setError("Could not create canvas context");
        setIsProcessingOcr(false);
        return;
      }
      
      // Set canvas dimensions to match video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      // Draw the current video frame to the canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Get the image data as a data URL
      const imageData = canvas.toDataURL('image/jpeg');
      
      // Initialize Tesseract worker
      const worker = await createWorker({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        logger: (progress: any) => {
          if (progress.status === 'recognizing text') {
            setOcrProgress(Math.round(progress.progress * 100));
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any); // Type assertion to bypass type checking for createWorker options
      
      // Set recognition options optimized for part numbers
      await (worker as unknown as TesseractWorker).loadLanguage('eng');
      await (worker as unknown as TesseractWorker).initialize('eng');
      await (worker as unknown as TesseractWorker).setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-', // Only allow characters likely in part numbers
        tessedit_pageseg_mode: '6', // Assume a single uniform block of text
      });
      
      // Perform OCR
      const result = await (worker as unknown as TesseractWorker).recognize(imageData);
      await (worker as unknown as TesseractWorker).terminate();
      
      // Process the recognized text
      const text = result.data.text.trim();
      console.log("OCR recognized text:", text);
      
      // Extract potential part numbers using regex patterns
      const partNumberPatterns = [
        /\b\d{4,10}\b/g, // 4-10 digit numbers
        /\b[A-Z]{1,3}\d{3,8}\b/g, // 1-3 letters followed by 3-8 digits
        /\b\d{3,6}-\d{1,4}\b/g, // Format like 123-456
      ];
      
      let partNumbers: string[] = [];
      for (const pattern of partNumberPatterns) {
        const matches = text.match(pattern);
        if (matches) partNumbers = [...partNumbers, ...matches];
      }
      
      // If we found potential part numbers
      if (partNumbers.length > 0) {
        console.log("Found potential part numbers:", partNumbers);
        // Use the first match as our result
        const partNumber = partNumbers[0];
        setScannedCode(partNumber);
        setScanSuccess(true);
        onScan(partNumber);
        
        // Close the dialog after a short delay
        setTimeout(() => {
          onClose();
          // Reset the state after closing
          setTimeout(() => {
            setScannedCode(null);
            setScanSuccess(false);
            setIsProcessingOcr(false);
          }, 300);
        }, 1500);
      } else {
        // No part numbers found, continue scanning
        setIsProcessingOcr(false);
        setTimeout(recognizeText, 1000); // Try again after a delay
      }
    } catch (err) {
      console.error("Error during OCR:", err);
      setError("Error recognizing text. Please try again.");
      setIsProcessingOcr(false);
    }
  }, [open, scanning, videoRef, onScan, onClose]);

  // Function to scan for barcodes
  const scanBarcode = React.useCallback(async () => {
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
            // Expand the scanning area to capture more of the video frame
            top: "10%",
            right: "10%",
            left: "10%",
            bottom: "10%"
          },
        },
        locator: {
          // Use smaller patch size for better detection of small barcodes
          patchSize: "small",
          // Disable half sample for higher accuracy with dense barcodes
          halfSample: false,
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
            // Prioritize industrial barcode formats first
            "code_39_reader",
            "code_39_vin_reader",
            "code_128_reader",
            "code_93_reader",
            // Include interleaved 2 of 5 which is common in industrial settings
            "i2of5_reader",
            "2of5_reader",
            // Include retail barcode formats
            "ean_reader",
            "ean_8_reader",
            "upc_reader",
            "upc_e_reader",
            "codabar_reader"
          ],
          multiple: false,
          // Add decoder settings for better detection
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true
          }
          // Note: supplements removed due to type compatibility issues
        },
        locate: true,
        frequency: 10, // Increase scan frequency for better detection
        debug: true
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
            
            // Process the code with more lenient acceptance criteria
            if (code) {
              // Clean up the code - remove any non-alphanumeric characters except dashes
              code = code.replace(/[^a-zA-Z0-9-]/g, '');
              
              // Log all detected codes with their format and confidence for debugging
              console.log(`Detected code: ${code}, Format: ${result.codeResult.format}, Confidence: ${result.codeResult.confidence}`);
              
              // Accept all alphanumeric codes with reasonable confidence
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const isStandalone = (window.navigator as any).standalone || 
                window.matchMedia('(display-mode: standalone)').matches;
              // Use very low confidence threshold to catch more potential matches
              const confidenceThreshold = isStandalone ? 0.2 : 0.3;
              
              if (result.codeResult.confidence > confidenceThreshold) {
                // For numeric-only codes, apply additional length validation
                if (/^\d+$/.test(code) && (code.length < 3 || code.length > 15)) {
                  console.log("Numeric code outside valid length range, continuing scan...");
                  return;
                }
                console.log("Valid barcode detected:", code);
              } else {
                // If confidence is too low, continue scanning
                console.log("Low confidence code, continuing scan...");
                return;
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
  }, [open, scanning, videoRef, facingMode, onScan, onClose]);

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
        
        // Request camera access with optimized constraints for barcode detection
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            // Higher resolution for better barcode detection
            width: { min: 1024, ideal: 1280, max: 1920 },
            height: { min: 720, ideal: 960, max: 1080 },
            // Lower frame rate for more stable images
            frameRate: { min: 15, ideal: 20, max: 30 },
            // Add additional camera constraints for better quality
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(typeof window !== 'undefined' ? { 
              zoom: 2,  // Increase zoom to get closer to barcodes
              focusMode: 'continuous', // Keep focus continuously adjusting
              focusDistance: 30, // Focus at a moderate distance
              exposureMode: 'continuous', // Continuous exposure adjustment
              whiteBalanceMode: 'continuous' // Continuous white balance adjustment
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any : {})
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
            
            // Start the appropriate scanning mode
            if (scanMode === "barcode") {
              await scanBarcode();
              quaggaInitialized = true;
            } else {
              await recognizeText();
            }
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, facingMode, scanMode, scanBarcode, recognizeText]);
  
  // This section intentionally left empty as the function has been moved above using useCallback
  
  // This section intentionally left empty as the function has been moved above using useCallback
  
  // Toggle between front and back camera
  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };
  
  // Toggle between barcode and text recognition modes
  const toggleScanMode = () => {
    // First stop any current scanning
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    
    setScanMode(prev => prev === "barcode" ? "text" : "barcode");
    setScanning(false);
    setError(null);
    setScanSuccess(false);
    setScannedCode(null);
    setIsProcessingOcr(false);
    
    // Restart the camera with new mode
    setTimeout(() => {
      setScanning(true);
    }, 300);
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{scanMode === "barcode" ? "Scan Barcode" : "Scan Part Number"}</DialogTitle>
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
            <Button
              variant={scanMode === "text" ? "default" : "secondary"}
              size="icon"
              onClick={toggleScanMode}
              title={scanMode === "barcode" ? "Switch to Text Recognition" : "Switch to Barcode Scanning"}
            >
              <Text className="h-4 w-4" />
              <span className="sr-only">Toggle Scan Mode</span>
            </Button>
          </div>
          
          {/* Show OCR progress indicator */}
          {scanMode === "text" && isProcessingOcr && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
              Processing: {ocrProgress}%
            </div>
          )}
        </div>
        
        <div className="text-sm text-center text-muted-foreground">
          {scanSuccess && scannedCode 
            ? `Successfully scanned ${scanMode === "barcode" ? "barcode" : "part number"}: ${scannedCode}` 
            : scanMode === "barcode" ? (
              <>
                <p>Position the barcode within the frame and hold steady.</p>
                <p className="mt-1">For small barcodes, position camera 3-6 inches away in good lighting.</p>
              </>
            ) : (
              <>
                <p>Position the part number text within the frame in good lighting.</p>
                <p className="mt-1">Hold steady and ensure text is clearly visible.</p>
                <p className="mt-1">Tap the <Text className="h-3 w-3 inline" /> button to switch between text and barcode scanning.</p>
              </>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
