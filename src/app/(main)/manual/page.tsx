"use client"

import PDFViewer from "@/components/PdfViewer";

export default function ManualPage() {
  const pdfUrl = "/factory-five-mk5-manual.pdf";
  
  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Factory Five Mk5 Manual</h1>
      <PDFViewer 
        pdfUrl={pdfUrl} 
        title="Factory Five Mk5 Manual" 
      />
    </div>
  );
}