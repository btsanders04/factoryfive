"use client"

import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PDFViewer = ({ pdfUrl, title }: { pdfUrl: string; title: string }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagesPerView, setPagesPerView] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Responsive width and pages per view calculation
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setContainerWidth(width);
        
        // Responsive pages per view
        setPagesPerView(width >= 768 ? 2 : 1);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return newPageNumber > 0 && newPageNumber <= numPages
        ? newPageNumber
        : prevPageNumber;
    });
  }

  const renderPages = () => {
    const pagesToRender = [];
    for (let i = 0; i < pagesPerView; i++) {
      const currentPage = pageNumber + i;
      if (currentPage <= numPages) {
        pagesToRender.push(
          <div 
            key={`page_${currentPage}`} 
            className="flex-shrink-0 flex justify-center"
          >
            <Page
              pageNumber={currentPage}
              width={Math.min(containerWidth / pagesPerView, 800)}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-md"
              loading={
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              }
            />
          </div>
        );
      }
    }
    return pagesToRender;
  };

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading PDF: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto bg-gray-100 p-2 sm:p-4 rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4 text-center">
        {title || "Factory Five Manual"}
      </h2>

      {isLoading && (
        <div className="flex items-center justify-center h-48 sm:h-96 w-full">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div 
        ref={containerRef}
        className="w-full overflow-auto bg-gray-100 p-2 sm:p-4 rounded mb-2 sm:mb-4"
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="text-center text-gray-600">
              Loading PDF...
            </div>
          }
        >
          <div className="flex space-x-2 sm:space-x-4 justify-center">
            {renderPages()}
          </div>
        </Document>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between w-full space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => changePage(-pagesPerView)}
            disabled={pageNumber <= 1}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Previous
          </button>
          <button
            onClick={() => changePage(pagesPerView)}
            disabled={pageNumber + pagesPerView > numPages}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Next
          </button>
          <span className="text-xs sm:text-sm">
            Page {pageNumber} - {Math.min(pageNumber + pagesPerView - 1, numPages)} of {numPages || "--"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;