"use client";

import React from "react";
import dynamic from "next/dynamic";

// Create a client-side only component for the PDF viewer
const PDFViewer = dynamic(() => import("@/components/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  ),
});

export default function Manual() {
  return (
      <PDFViewer
        pdfUrl="/factory-five-mk5-manual.pdf"
        title="Factory Five Mk5 Roadster Assembly Manual"
      />
  );
}
