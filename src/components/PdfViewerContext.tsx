"use client";

import React, { createContext, useContext, useRef } from "react";

interface PdfViewerContextType {
  navigateToPage: (page: number) => void;
  pdfViewerRef: React.MutableRefObject<{ navigateToPage: (page: number) => void } | null>;
}

const PdfViewerContext = createContext<PdfViewerContextType | null>(null);

export function PdfViewerProvider({ children }: { children: React.ReactNode }) {
  const pdfViewerRef = useRef<{ navigateToPage: (page: number) => void } | null>(null);

  const navigateToPage = (page: number) => {
    if (pdfViewerRef.current) {
      pdfViewerRef.current.navigateToPage(page);
    }
  };

  return (
    <PdfViewerContext.Provider value={{ navigateToPage, pdfViewerRef }}>
      {children}
    </PdfViewerContext.Provider>
  );
}

export function usePdfViewer() {
  const context = useContext(PdfViewerContext);
  if (!context) {
    throw new Error("usePdfViewer must be used within a PdfViewerProvider");
  }
  return context;
} 