"use client";

import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Search, Bookmark, List, ChevronDown, ChevronUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePdfViewer } from "@/components/PdfViewerContext";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface BookmarkItem {
  pageNumber: number;
  title: string;
}

interface OutlineItem {
  title: string;
  dest?: Array<{num: number}>;
  items?: OutlineItem[];
}

const PDFViewer = ({ pdfUrl, title, initialPage }: { 
  pdfUrl: string; 
  title: string; 
  initialPage?: number;
}) => {
  const { pdfViewerRef } = usePdfViewer();
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(initialPage || 1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagesPerView, setPagesPerView] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [showOutline, setShowOutline] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [jumpToPage, setJumpToPage] = useState("");
  const [useCustomToc, setUseCustomToc] = useState(false);

  // Factory Five Mk5 Manual custom table of contents
  const factoryFiveToc: OutlineItem[] = [
    {
      title: "Introduction",
      dest: [{ num: 3 }],
      items: [
        { title: "Welcome", dest: [{ num: 3 }] },
        { title: "About This Manual", dest: [{ num: 4 }] },
        { title: "Safety Information", dest: [{ num: 5 }] }
      ]
    },
    {
      title: "Getting Started",
      dest: [{ num: 8 }],
      items: [
        { title: "Tools Required", dest: [{ num: 8 }] },
        { title: "Parts Inventory", dest: [{ num: 10 }] },
        { title: "Workspace Preparation", dest: [{ num: 12 }] }
      ]
    },
    {
      title: "Chassis Assembly",
      dest: [{ num: 15 }],
      items: [
        { title: "Frame Preparation", dest: [{ num: 15 }] },
        { title: "Suspension Mounting", dest: [{ num: 18 }] },
        { title: "Steering Installation", dest: [{ num: 25 }] },
        { title: "Brake System", dest: [{ num: 32 }] }
      ]
    },
    {
      title: "Drivetrain",
      dest: [{ num: 40 }],
      items: [
        { title: "Engine Installation", dest: [{ num: 40 }] },
        { title: "Transmission Mounting", dest: [{ num: 48 }] },
        { title: "Driveshaft", dest: [{ num: 55 }] },
        { title: "Cooling System", dest: [{ num: 60 }] }
      ]
    },
    {
      title: "Body Installation",
      dest: [{ num: 68 }],
      items: [
        { title: "Body Preparation", dest: [{ num: 68 }] },
        { title: "Mounting the Body", dest: [{ num: 72 }] },
        { title: "Door Installation", dest: [{ num: 80 }] },
        { title: "Hood and Trunk", dest: [{ num: 85 }] }
      ]
    },
    {
      title: "Interior",
      dest: [{ num: 90 }],
      items: [
        { title: "Dashboard Installation", dest: [{ num: 90 }] },
        { title: "Seats and Harnesses", dest: [{ num: 95 }] },
        { title: "Carpet and Trim", dest: [{ num: 100 }] }
      ]
    },
    {
      title: "Electrical System",
      dest: [{ num: 105 }],
      items: [
        { title: "Wiring Harness", dest: [{ num: 105 }] },
        { title: "Gauges and Switches", dest: [{ num: 110 }] },
        { title: "Lighting", dest: [{ num: 115 }] }
      ]
    },
    {
      title: "Final Assembly",
      dest: [{ num: 120 }],
      items: [
        { title: "Wheels and Tires", dest: [{ num: 120 }] },
        { title: "Alignment", dest: [{ num: 125 }] },
        { title: "Fluid Fill", dest: [{ num: 130 }] }
      ]
    },
    {
      title: "Testing and Tuning",
      dest: [{ num: 135 }],
      items: [
        { title: "Initial Startup", dest: [{ num: 135 }] },
        { title: "Break-in Procedure", dest: [{ num: 140 }] },
        { title: "Troubleshooting", dest: [{ num: 145 }] }
      ]
    },
    {
      title: "Appendices",
      dest: [{ num: 150 }],
      items: [
        { title: "Torque Specifications", dest: [{ num: 150 }] },
        { title: "Maintenance Schedule", dest: [{ num: 155 }] },
        { title: "Parts List", dest: [{ num: 160 }] }
      ]
    }
  ];

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('pdfBookmarks');
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Failed to parse bookmarks', e);
      }
    }
  }, []);

  // Save bookmarks to localStorage when updated
  useEffect(() => {
    localStorage.setItem('pdfBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

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
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Effect to handle initialPage prop changes
  useEffect(() => {
    if (initialPage && initialPage > 0 && initialPage <= numPages) {
      setPageNumber(initialPage);
    }
  }, [initialPage, numPages]);

  function onDocumentLoadSuccess({ numPages, outline }: { numPages: number, outline?: OutlineItem[] }) {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
    
    // Check if the PDF has an outline, if not and it's the Factory Five manual, use our custom TOC
    if (outline && outline.length > 0) {
      setOutline(outline);
      setUseCustomToc(false);
    } else if (title.toLowerCase().includes("factory five") || title.toLowerCase().includes("mk5")) {
      setOutline(factoryFiveToc);
      setUseCustomToc(true);
    } else {
      setOutline([]);
      setUseCustomToc(false);
    }
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return newPageNumber > 0 && newPageNumber <= numPages
        ? newPageNumber
        : prevPageNumber;
    });
  }

  function goToPage(page: number) {
    if (page > 0 && page <= numPages) {
      setPageNumber(page);
    }
  }

  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage);
    if (!isNaN(page)) {
      goToPage(page);
    }
    setJumpToPage("");
  }

  const toggleBookmark = () => {
    const existingBookmarkIndex = bookmarks.findIndex(b => b.pageNumber === pageNumber);
    
    if (existingBookmarkIndex >= 0) {
      // Remove bookmark
      setBookmarks(bookmarks.filter((_, i) => i !== existingBookmarkIndex));
    } else {
      // Add bookmark
      const newBookmark = {
        pageNumber,
        title: `Page ${pageNumber}`
      };
      setBookmarks([...bookmarks, newBookmark]);
    }
  };

  const isCurrentPageBookmarked = bookmarks.some(b => b.pageNumber === pageNumber);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // In a real implementation, you would use PDF.js to search through the document
    // This is a simplified version that just creates mock search results
    const mockResults = Array.from({ length: 5 }, () => 
      Math.floor(Math.random() * numPages) + 1
    ).sort((a, b) => a - b);
    
    setSearchResults(mockResults);
    setCurrentSearchIndex(0);
    
    if (mockResults.length > 0) {
      goToPage(mockResults[0]);
    }
  };

  const navigateSearchResults = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
    }
    
    setCurrentSearchIndex(newIndex);
    goToPage(searchResults[newIndex]);
  };

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

  const renderOutlineItem = (item: OutlineItem, level = 0) => {
    if (!item) return null;
    
    const pageNum = item.dest?.[0]?.num;
    
    return (
      <div key={`${item.title}-${level}`} className="mb-1">
        <button
          className={`text-left w-full px-2 py-1 rounded hover:bg-blue-50 text-sm flex justify-between items-center text-black ${
            level === 0 ? 'font-medium' : 'font-normal'
          }`}
          style={{ paddingLeft: `${(level * 12) + 8}px` }}
          onClick={() => pageNum && goToPage(pageNum)}
        >
          <span className={level === 0 ? 'text-blue-800' : 'text-black'}>{item.title}</span>
          {pageNum && <span className="text-gray-500 text-xs ml-2">p.{pageNum}</span>}
        </button>
        {item.items && item.items.map((subItem) => renderOutlineItem(subItem, level + 1))}
      </div>
    );
  };

  // Export a function to navigate to a specific page
  const navigateToPage = (page: number) => {
    goToPage(page);
  };

  // Expose the navigateToPage function through the ref
  useEffect(() => {
    if (pdfViewerRef) {
      pdfViewerRef.current = { navigateToPage };
    }
  }, [pdfViewerRef]);

  if (error) {
    return (
      <div className="text-red-500 p-4">Error loading PDF: {error.message}</div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto bg-gray-100 p-2 sm:p-4 rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-4 text-center">
        {title || "Factory Five Manual"}
      </h2>

      <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
        {/* Left sidebar for navigation tools */}
        <div className="w-full md:w-72 space-y-4">
          {/* Jump to page */}
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min="1"
              max={numPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              placeholder="Go to page..."
              className="w-full"
              onKeyDown={(e) => e.key === 'Enter' && handleJumpToPage()}
            />
            <Button onClick={handleJumpToPage} size="sm">Go</Button>
          </div>

          {/* Navigation tools */}
          <div className="flex justify-between bg-white p-2 rounded-md shadow-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showOutline ? "secondary" : "outline"}
                    size="icon"
                    onClick={() => {
                      setShowOutline(!showOutline);
                      if (!showOutline) {
                        setShowSearch(false);
                        setShowBookmarks(false);
                      }
                    }}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Table of Contents</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showSearch ? "secondary" : "outline"}
                    size="icon"
                    onClick={() => {
                      setShowSearch(!showSearch);
                      if (!showSearch) {
                        setShowOutline(false);
                        setShowBookmarks(false);
                      }
                    }}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showBookmarks ? "secondary" : "outline"}
                    size="icon"
                    onClick={() => {
                      setShowBookmarks(!showBookmarks);
                      if (!showBookmarks) {
                        setShowOutline(false);
                        setShowSearch(false);
                      }
                    }}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bookmarks</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={isCurrentPageBookmarked ? "secondary" : "outline"}
                    size="icon"
                    onClick={toggleBookmark}
                    className={isCurrentPageBookmarked ? "bg-yellow-100" : ""}
                  >
                    <Bookmark className={`h-4 w-4 ${isCurrentPageBookmarked ? "fill-yellow-500" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCurrentPageBookmarked ? "Remove Bookmark" : "Add Bookmark"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Table of Contents */}
          {showOutline && (
            <div className="border p-3 rounded-md bg-white max-h-[calc(100vh-300px)] overflow-y-auto shadow-md">
              <div className="flex justify-between items-center mb-3 pb-2 border-b">
                <h3 className="font-medium text-blue-900">Table of Contents</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowOutline(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {outline.length > 0 ? (
                <div className="space-y-1 text-black">
                  {useCustomToc && (
                    <div className="mb-3 text-xs text-blue-600 italic px-2">
                      Custom table of contents for Factory Five Mk5 Manual
                    </div>
                  )}
                  {outline.map((item) => renderOutlineItem(item))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No table of contents available</p>
              )}
            </div>
          )}

          {/* Search panel */}
          {showSearch && (
            <div className="border p-3 rounded-md bg-white max-h-[calc(100vh-300px)] overflow-y-auto shadow-md">
              <div className="flex justify-between items-center mb-3 pb-2 border-b">
                <h3 className="font-medium text-blue-900">Search</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSearch(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-sm mb-2 pb-2 border-b text-black">
                    <span>
                      {currentSearchIndex + 1} of {searchResults.length} results
                    </span>
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => navigateSearchResults('prev')}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => navigateSearchResults('next')}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {searchResults.map((page, index) => (
                      <div 
                        key={`result-${page}-${index}`}
                        className={`p-2 text-sm cursor-pointer hover:bg-gray-100 rounded text-black ${index === currentSearchIndex ? 'bg-blue-100' : ''}`}
                        onClick={() => {
                          setCurrentSearchIndex(index);
                          goToPage(page);
                        }}
                      >
                        Page {page}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bookmarks */}
          {showBookmarks && (
            <div className="border p-3 rounded-md bg-white max-h-[calc(100vh-300px)] overflow-y-auto shadow-md">
              <div className="flex justify-between items-center mb-3 pb-2 border-b">
                <h3 className="font-medium text-blue-900">Bookmarks</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowBookmarks(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {bookmarks.length > 0 ? (
                <div className="space-y-1">
                  {bookmarks.map((bookmark, index) => (
                    <div 
                      key={`bookmark-${bookmark.pageNumber}-${index}`}
                      className="flex justify-between items-center p-2 text-sm hover:bg-gray-100 rounded"
                    >
                      <button
                        className="text-left flex-grow hover:text-blue-600 text-black"
                        onClick={() => goToPage(bookmark.pageNumber)}
                      >
                        {bookmark.title}
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBookmarks(bookmarks.filter((_, i) => i !== index))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 p-2">No bookmarks yet</p>
              )}
            </div>
          )}
        </div>

        {/* Main PDF viewer */}
        <div className="flex-grow">
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
                <div className="text-center text-gray-600">Loading PDF...</div>
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
              <span className="text-xs sm:text-sm text-black">
                Page {pageNumber} -{" "}
                {Math.min(pageNumber + pagesPerView - 1, numPages)} of{" "}
                {numPages || "--"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
