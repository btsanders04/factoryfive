"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pdfjs } from "react-pdf";

interface OutlineItem {
  title: string;
  dest?: Array<{ num: number }>;
  items?: OutlineItem[];
}

interface PdfTableOfContentsProps {
  pdfUrl: string;
  onClose: () => void;
  onPageSelect: (pageNumber: number) => void;
  isOpen: boolean;
}

interface PdfOutlineItem {
  title: string;
  dest?: string | unknown[] | null;
  items?: PdfOutlineItem[];
  // Additional properties that might be present in PDF.js outline items
  bold?: boolean;
  italic?: boolean;
  color?: Uint8ClampedArray;
  url?: string | null;
  unsafeUrl?: string;
  newWindow?: boolean;
  count?: number;
}

interface PdfTextItem {
  str: string;
  height?: number;
  transform?: number[];
  fontName?: string;
  hasEOL?: boolean;
}

// Factory Five Mk5 Manual table of contents structure
// This is used as a fallback if we can't extract the TOC from the PDF
const factoryFiveToc: OutlineItem[] = [
  {
    title: "Foreword",
    dest: [{ num: 9 }],
    items: [],
  },
  {
    title: "Safety Notice",
    dest: [{ num: 11 }],
    items: [],
  },
  {
    title: "Safety Tips",
    dest: [{ num: 12 }],
    items: [],
  },
  {
    title: "How to use This Book",
    dest: [{ num: 13 }],
    items: [],
  },
  {
    title: "What You Need",
    dest: [{ num: 13 }],
    items: [],
  },
  {
    title: "Serial Number Identification",
    dest: [{ num: 15 }],
    items: [],
  },
  {
    title: "Optional part Instructions",
    dest: [{ num: 15 }],
    items: [],
  },
  {
    title: "Tools List",
    dest: [{ num: 16 }],
    items: [],
  },
  {
    title: "Required Supplies",
    dest: [{ num: 17 }],
    items: [],
  },
  {
    title: "Helpful Tools",
    dest: [{ num: 17 }],
    items: [],
  },
  {
    title: "Donor Parts and Prep",
    dest: [{ num: 18 }],
    items: [
      { title: "Not using a donor", dest: [{ num: 19 }] },
      { title: "Donor Part Preparation", dest: [{ num: 19 }] },
      { title: "Solid Axle", dest: [{ num: 19 }] },
      { title: "Front Lower Control Arms", dest: [{ num: 20 }] },
      { title: "Fuel Tank", dest: [{ num: 22 }] },
      { title: "Fuel Filler Neck", dest: [{ num: 22 }] },
      { title: "Steering Rack", dest: [{ num: 22 }] },
      { title: "Cleaning and Detailing", dest: [{ num: 23 }] },
    ],
  },
  {
    title: "Disassembly of the kit",
    dest: [{ num: 24 }],
    items: [
      { title: "Unpacking Your Kit", dest: [{ num: 25 }] },
      { title: "Fastener Pack", dest: [{ num: 25 }] },
      { title: "Kit Parts Prep", dest: [{ num: 25 }] },
      { title: "Carpet and Dash", dest: [{ num: 25 }] },
      { title: "Body Removal", dest: [{ num: 26 }] },
      { title: "Aluminum Removal", dest: [{ num: 29 }] },
    ],
  },
  {
    title: "Chassis Assembly",
    dest: [{ num: 34 }],
    items: [
      { title: "Steering Rack", dest: [{ num: 35 }] },
      { title: "Donor Mustang power steering rack prep", dest: [{ num: 35 }] },
      {
        title: "FFR manual or optional power steering rack prep",
        dest: [{ num: 36 }],
      },
      { title: "Steering rack install", dest: [{ num: 38 }] },
      { title: "Front Suspension", dest: [{ num: 44 }] },
      { title: "Front lower control arm", dest: [{ num: 44 }] },
      { title: "Front upper control arm", dest: [{ num: 47 }] },
      { title: "Pivot endplay", dest: [{ num: 51 }] },
      { title: "Adjusting the upper control Arm", dest: [{ num: 51 }] },
      { title: "Front Coil-Over Shock Assembly", dest: [{ num: 52 }] },
      { title: "Front Sway bar (Optional)", dest: [{ num: 59 }] },
      { title: "Spindles", dest: [{ num: 65 }] },
      { title: "Front Suspension Torque Specs Chart", dest: [{ num: 69 }] },
      { title: "Steering Tie Rod Ends", dest: [{ num: 70 }] },
      { title: "Front Brakes", dest: [{ num: 73 }] },
      { title: "Solid Axle Rear Suspension", dest: [{ num: 81 }] },
      { title: "3-Link Fasteners", dest: [{ num: 82 }] },
      { title: "Solid Axle Preparation", dest: [{ num: 82 }] },
      { title: "3 Link Rear Suspension", dest: [{ num: 87 }] },
      { title: "Rear Axle install", dest: [{ num: 91 }] },
      { title: "Panhard Bar Frame mount", dest: [{ num: 93 }] },
      { title: "Rear Coil-Over Shock Assembly", dest: [{ num: 93 }] },
      { title: "Panhard Bar", dest: [{ num: 101 }] },
      {
        title: "3 link Rear Suspension Torque Specs Chart",
        dest: [{ num: 102 }],
      },
      { title: "Optional Independent Rear Suspension", dest: [{ num: 103 }] },
      { title: "Parts needed", dest: [{ num: 103 }] },
      { title: "IRS Fasteners", dest: [{ num: 103 }] },
      { title: "Parts preparation", dest: [{ num: 104 }] },
      { title: "Installation", dest: [{ num: 112 }] },
      { title: "Coil-Over Shock Assembly", dest: [{ num: 126 }] },
      { title: "Optional IRS Brakes", dest: [{ num: 131 }] },
      { title: "IRS CV axle Nut", dest: [{ num: 131 }] },
      { title: "IRS Swaybar (Optional)", dest: [{ num: 131 }] },
      { title: "Fluids", dest: [{ num: 137 }] },
      { title: "Capacities", dest: [{ num: 137 }] },
      { title: "Alignment specs", dest: [{ num: 137 }] },
      { title: "Torque Specifications", dest: [{ num: 138 }] },
      { title: "Emergency Brake", dest: [{ num: 139 }] },
      { title: "E-brake Handle", dest: [{ num: 139 }] },
      { title: "E-brake cables", dest: [{ num: 155 }] },
      { title: "Fuel System", dest: [{ num: 163 }] },
      { title: "Frame prep", dest: [{ num: 163 }] },
      { title: "Fuel Tank Vent", dest: [{ num: 166 }] },
      { title: "Fuel Pick-up", dest: [{ num: 168 }] },
      { title: "Fuel Gauge Sender", dest: [{ num: 173 }] },
      { title: "Fuel filler neck", dest: [{ num: 175 }] },
      { title: "Tank prep", dest: [{ num: 178 }] },
      { title: "Fuel tank install", dest: [{ num: 179 }] },
      { title: "Fuel filter", dest: [{ num: 181 }] },
      { title: "Hard lines", dest: [{ num: 184 }] },
      { title: "Vent hose", dest: [{ num: 188 }] },
      { title: "Pedal Box", dest: [{ num: 189 }] },
    ],
  },
  {
    title: "Chassis Assembly (continued)",
    dest: [{ num: 34 }],
    items: [
      // Previous items...

      { title: "Pedal pads", dest: [{ num: 190 }] },
      { title: "Brake switch mount", dest: [{ num: 190 }] },
      { title: "Clutch safety switch mount", dest: [{ num: 191 }] },
      { title: "Clutch Cable Quadrant", dest: [{ num: 192 }] },
      { title: "Frame Installation", dest: [{ num: 194 }] },
      { title: "Using Hydraulic clutch", dest: [{ num: 197 }] },
      { title: "Master Cylinders", dest: [{ num: 199 }] },
      { title: "Balance Bar adjustment", dest: [{ num: 203 }] },
      { title: "Accelerator Pedal", dest: [{ num: 205 }] },
      { title: "OEM Mustang", dest: [{ num: 205 }] },
      { title: "Complete kit Accelerator Pedal", dest: [{ num: 205 }] },
      { title: "Rivet Spacing Tool", dest: [{ num: 211 }] },
      { title: "Driver Front Footbox Aluminum", dest: [{ num: 211 }] },
      { title: "Steering System", dest: [{ num: 213 }] },
      { title: "Turn Signal switch assembly", dest: [{ num: 214 }] },
      { title: "Bearings", dest: [{ num: 215 }] },
      { title: "U-Joints", dest: [{ num: 217 }] },
      { title: "Steering shaft mounting", dest: [{ num: 223 }] },
      {
        title: "Upper Steering Shaft/Turn signal assembly adjustment",
        dest: [{ num: 225 }],
      },
      { title: "Cockpit Aluminum", dest: [{ num: 229 }] },
      { title: "Right footbox aluminum", dest: [{ num: 230 }] },
      { title: "Left footbox aluminum", dest: [{ num: 233 }] },
      { title: "Cockpit lower rear wall", dest: [{ num: 235 }] },
      { title: "Cockpit floors", dest: [{ num: 236 }] },
      { title: "Under door", dest: [{ num: 238 }] },
      { title: "Cockpit rear outside corners", dest: [{ num: 238 }] },
      { title: "Cockpit upper rear wall", dest: [{ num: 240 }] },
      { title: "Brake System", dest: [{ num: 240 }] },
      { title: "Brake reservoir", dest: [{ num: 240 }] },
      { title: "Brake Booster (Optional)", dest: [{ num: 246 }] },
      { title: "Front flexible brake lines", dest: [{ num: 249 }] },
      { title: "Hard Brake lines", dest: [{ num: 253 }] },
      { title: "Banjo bolt torque specs", dest: [{ num: 265 }] },
      { title: "Brake fluid filling/bleeding", dest: [{ num: 266 }] },
      { title: "Pedal adjustment", dest: [{ num: 267 }] },
      { title: "Chassis wiring harness (Complete kit)", dest: [{ num: 268 }] },
      { title: "Turn Signal Wiring (complete kit)", dest: [{ num: 268 }] },
      { title: "Ignition switch", dest: [{ num: 270 }] },
      { title: "Trunk Aluminum", dest: [{ num: 270 }] },
      { title: "Engine Prep", dest: [{ num: 273 }] },
      { title: "Engine/Transmission Installation", dest: [{ num: 277 }] },
      { title: "Transmission Mount", dest: [{ num: 278 }] },
      { title: "Engine Ground", dest: [{ num: 280 }] },
      { title: "Battery Mounting and Cable", dest: [{ num: 281 }] },
      { title: "Battery tray", dest: [{ num: 281 }] },
      { title: "Battery cable", dest: [{ num: 287 }] },
      { title: "Headers and J-pipes", dest: [{ num: 288 }] },
      { title: "Fuel line to engine", dest: [{ num: 290 }] },
      { title: "Oil Filter Relocator", dest: [{ num: 291 }] },
      { title: "Clutch Cable", dest: [{ num: 292 }] },
      { title: "Accelerator Cable", dest: [{ num: 294 }] },
      { title: "87-93 5.0L Fuel Injected Applications", dest: [{ num: 295 }] },
      { title: "Carbureted applications", dest: [{ num: 296 }] },
      { title: "Interior Fitment", dest: [{ num: 297 }] },
      { title: "Engine Wiring", dest: [{ num: 297 }] },
      { title: "Cooling System", dest: [{ num: 298 }] },
      { title: "Fan Mounting", dest: [{ num: 298 }] },
    ],
  },
  {
    title: "Cooling System (continued)",
    dest: [{ num: 298 }],
    items: [
      { title: "Radiator mounting – Mustang", dest: [{ num: 301 }] },
      { title: "Radiator mounting – complete kit", dest: [{ num: 305 }] },
      { title: "A/C Evaporator", dest: [{ num: 308 }] },
      { title: "Stainless Radiator Hoses", dest: [{ num: 309 }] },
      { title: "Overflow Tank", dest: [{ num: 312 }] },
      { title: "Fan Wiring", dest: [{ num: 314 }] },
      { title: "Speedometer Sending Unit", dest: [{ num: 315 }] },
      { title: "IRS CV axle Nut", dest: [{ num: 317 }] },
      { title: "IRS Driveshaft adapter", dest: [{ num: 318 }] },
      { title: "Driveshaft", dest: [{ num: 319 }] },
      { title: "Solid axle", dest: [{ num: 320 }] },
      { title: "IRS", dest: [{ num: 321 }] },
      { title: "Aluminum panels", dest: [{ num: 322 }] },
      { title: "Transmission Tunnel rear corners", dest: [{ num: 323 }] },
      { title: "Transmission Tunnel U-Joint cover", dest: [{ num: 323 }] },
      { title: "Transmission tunnel front corners", dest: [{ num: 324 }] },
      { title: "Transmission Tunnel front top cover", dest: [{ num: 324 }] },
      { title: "Transmission Tunnel Cover", dest: [{ num: 325 }] },
      { title: "Left Footbox Side Aluminum", dest: [{ num: 325 }] },
      { title: "Right Footbox Side Aluminum", dest: [{ num: 326 }] },
      { title: "Trunk Recess Aluminum", dest: [{ num: 327 }] },
      { title: "Seats", dest: [{ num: 331 }] },
      { title: "Nameplate", dest: [{ num: 333 }] },
      { title: "Horns", dest: [{ num: 334 }] },
      { title: "Steering Wheel", dest: [{ num: 341 }] },
      { title: "Rollbar", dest: [{ num: 343 }] },
      { title: "Rollbar drilling", dest: [{ num: 345 }] },
      { title: "Trunk Hinge Arms", dest: [{ num: 347 }] },
      { title: "Trunk gas struts (Optional)", dest: [{ num: 348 }] },
      { title: "Rolling Chassis Check", dest: [{ num: 352 }] },
      { title: "Front Suspension", dest: [{ num: 352 }] },
      { title: "Fluid Levels and Grease", dest: [{ num: 352 }] },
      { title: "Suspension", dest: [{ num: 354 }] },
      { title: "IRS Axle Nuts", dest: [{ num: 354 }] },
      { title: "Wheels", dest: [{ num: 355 }] },
      { title: "Rattle Patrol", dest: [{ num: 355 }] },
      { title: "Footbox Fitment", dest: [{ num: 356 }] },
    ],
  },
  {
    title: "Body Section",
    dest: [{ num: 358 }],
    items: [
      { title: "Frame prep (Weatherstrip)", dest: [{ num: 359 }] },
      { title: "Mounting the Body", dest: [{ num: 360 }] },
      { title: "Rear Quick Jacks", dest: [{ num: 360 }] },
      { title: "Side mounts", dest: [{ num: 362 }] },
      { title: "Front mounts", dest: [{ num: 364 }] },
      { title: "Hood", dest: [{ num: 366 }] },
      { title: "Fitment and bumpers", dest: [{ num: 366 }] },
      { title: "Hood Hinge", dest: [{ num: 369 }] },
      { title: "Hood Handles", dest: [{ num: 375 }] },
      { title: "Hood Scoop", dest: [{ num: 381 }] },
      { title: "Hood fitment", dest: [{ num: 386 }] },
      { title: "Windshield", dest: [{ num: 395 }] },
      { title: "Interior Rearview Mirror", dest: [{ num: 400 }] },
      { title: "Door fitment", dest: [{ num: 403 }] },
      { title: "Door Latch", dest: [{ num: 406 }] },
      { title: "Striker", dest: [{ num: 408 }] },
      { title: "Trunk fitment", dest: [{ num: 409 }] },
      { title: "Trunk Latch", dest: [{ num: 410 }] },
      { title: "Side Mirror (Polished GT400)", dest: [{ num: 419 }] },
      { title: "Side Mirror (Brushed GT300)", dest: [{ num: 423 }] },
      { title: "Body Stripes/centerline", dest: [{ num: 424 }] },
      { title: "Body Cut-outs", dest: [{ num: 425 }] },
      { title: "Fuel filler", dest: [{ num: 425 }] },
      { title: "Tail light", dest: [{ num: 428 }] },
      { title: "Turn Signal", dest: [{ num: 429 }] },
      { title: "License plate light", dest: [{ num: 431 }] },
      { title: "Side exhaust", dest: [{ num: 435 }] },
      { title: "Headlights", dest: [{ num: 436 }] },
      { title: "Side louver", dest: [{ num: 439 }] },
      { title: "Roll bar", dest: [{ num: 440 }] },
      { title: "Final Prep", dest: [{ num: 445 }] },
      { title: "Body Painting", dest: [{ num: 447 }] },
    ],
  },
  {
    title: "Final Assembly",
    dest: [{ num: 448 }],
    items: [
      { title: "Carpet", dest: [{ num: 449 }] },
      { title: "Seats Harness", dest: [{ num: 460 }] },
      { title: "lap belt", dest: [{ num: 461 }] },
      { title: "Seat Final Install", dest: [{ num: 462 }] },
      { title: "Seat Harness Shoulder Belts", dest: [{ num: 462 }] },
      { title: "Shifter Handle and Boot", dest: [{ num: 466 }] },
      { title: "Emergency Brake Boot", dest: [{ num: 469 }] },
      { title: "Before body mounting", dest: [{ num: 471 }] },
      { title: "Headlights", dest: [{ num: 471 }] },
      { title: "Turn Signals", dest: [{ num: 477 }] },
      { title: "Tail lights", dest: [{ num: 478 }] },
      { title: "Gas Cap", dest: [{ num: 479 }] },
      { title: "Side Louvers", dest: [{ num: 480 }] },
      { title: "Weatherstripping", dest: [{ num: 483 }] },
      { title: "Final Body Mounting", dest: [{ num: 485 }] },
      { title: "Hood mounting", dest: [{ num: 486 }] },
      { title: "Radiator Aluminum", dest: [{ num: 487 }] },
      { title: "Rollbar mounting", dest: [{ num: 491 }] },
      { title: "Interior Rearview Mirror", dest: [{ num: 492 }] },
      { title: "Windshield Mounting", dest: [{ num: 493 }] },
      { title: "Door and Latch mount", dest: [{ num: 497 }] },
      { title: "Fuel Filler Neck", dest: [{ num: 498 }] },
      { title: "Fuel tank access covers", dest: [{ num: 500 }] },
      { title: "Final Trunk Mounting", dest: [{ num: 501 }] },
      { title: "Side Mirror", dest: [{ num: 501 }] },
      { title: "Light wiring", dest: [{ num: 503 }] },
      { title: "Check straps", dest: [{ num: 504 }] },
      { title: "Under door Aluminum", dest: [{ num: 506 }] },
      { title: "Gauges and Dash", dest: [{ num: 509 }] },
      { title: "Dash prep", dest: [{ num: 511 }] },
      { title: "Gauges", dest: [{ num: 517 }] },
      { title: "Base kit switches", dest: [{ num: 519 }] },
      { title: "Complete kit switches", dest: [{ num: 520 }] },
      { title: "Turn signal lights", dest: [{ num: 525 }] },
      { title: "Dash Install", dest: [{ num: 526 }] },
      { title: "Steering wheel center section", dest: [{ num: 526 }] },
      { title: "Side Exhaust", dest: [{ num: 528 }] },
      { title: "Aluminum Splash guards", dest: [{ num: 531 }] },
      { title: "Front Wheel", dest: [{ num: 532 }] },
      { title: "Rear Wheel", dest: [{ num: 534 }] },
      { title: "Finishing Touches", dest: [{ num: 536 }] },
      { title: "Headlight Alignment", dest: [{ num: 536 }] },
      { title: "Alignment Specifications", dest: [{ num: 538 }] },
      { title: "Brake Testing", dest: [{ num: 540 }] },
      { title: "Pad Bedding", dest: [{ num: 541 }] },
      { title: "Optional Parts", dest: [{ num: 541 }] },
    ],
  },
  {
    title: "Performance Reference Material and Technical Support",
    dest: [{ num: 542 }],
    items: [
      { title: "Maintenance", dest: [{ num: 543 }] },
      { title: "Wheels", dest: [{ num: 543 }] },
      { title: "1994-1998 rear end", dest: [{ num: 544 }] },
      { title: "Performance Modifications", dest: [{ num: 544 }] },
      { title: "Gears", dest: [{ num: 545 }] },
      { title: "High Horsepower Transmissions", dest: [{ num: 545 }] },
      { title: "Steering Rack", dest: [{ num: 545 }] },
      { title: "High Performance Braking Systems", dest: [{ num: 545 }] },
      { title: "Miscellaneous Brake Information", dest: [{ num: 546 }] },
      { title: "Seats", dest: [{ num: 546 }] },
      { title: "Helpful Reference Material", dest: [{ num: 546 }] },
      { title: "Must Reads", dest: [{ num: 546 }] },
      { title: "Helpful", dest: [{ num: 546 }] },
      { title: "Catalogs/Parts", dest: [{ num: 546 }] },
      { title: "Factory Five Aftermarket", dest: [{ num: 546 }] },
      { title: "Tools", dest: [{ num: 547 }] },
      { title: "Insurance", dest: [{ num: 547 }] },
      {
        title: "A Final Note about Completed Cars and Car Builders",
        dest: [{ num: 547 }],
      },
    ],
  },
  {
    title: "Appendices",
    dest: [{ num: 548 }],
    items: [
      { title: "Appendix A – Templates", dest: [{ num: 548 }] },
      { title: "Appendix B – Driveshafts", dest: [{ num: 556 }] },
      { title: "Appendix C – Race car check sheet", dest: [{ num: 557 }] },
      { title: "Appendix D – Fluid Specifications", dest: [{ num: 560 }] },
      { title: "Appendix E – Torque Specifications", dest: [{ num: 561 }] },
      { title: "Appendix F – Metric Fastener Lengths", dest: [{ num: 562 }] },
      { title: "Appendix G – Standard Fastener Lengths", dest: [{ num: 563 }] },
      { title: "Appendix H – Fastener Pack List", dest: [{ num: 564 }] },
    ],
  },
];

export function PdfTableOfContents({
  pdfUrl,
  onClose,
  onPageSelect,
  isOpen,
}: PdfTableOfContentsProps) {
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usedFactoryFiveToc, setUsedFactoryFiveToc] = useState(false);

  useEffect(() => {
    if (!isOpen || !pdfUrl) return;

    const extractOutline = async () => {
      setIsLoading(true);
      setError(null);
      setUsedFactoryFiveToc(false);

      try {
        // Load the PDF document
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        // Get the outline (table of contents)
        const outline = await pdf.getOutline();

        if (outline && outline.length > 0) {
          // Process the outline to match our OutlineItem structure
          const processedOutline = processOutline(
            outline as PdfOutlineItem[],
            pdf
          );
          setOutline(processedOutline);
        } else {
          // Check if this is likely the Factory Five manual by looking at the title or filename
          const isFactoryFiveManual =
            pdfUrl.toLowerCase().includes("factory-five") ||
            pdfUrl.toLowerCase().includes("mk5");

          if (isFactoryFiveManual) {
            // Use our pre-defined Factory Five TOC
            setOutline(factoryFiveToc);
            setUsedFactoryFiveToc(true);
          } else {
            // Try to extract TOC from the first 8 pages
            const extractedToc = await extractTocFromPages(pdf);

            if (extractedToc.length > 0) {
              setOutline(extractedToc);
            } else {
              // If all else fails, generate one based on document structure
              const generatedOutline = await generateOutlineFromContent(pdf);
              setOutline(generatedOutline);
            }
          }
        }
      } catch (err) {
        console.error("Error extracting PDF outline:", err);
        setError("Failed to extract table of contents");
      } finally {
        setIsLoading(false);
      }
    };

    extractOutline();
  }, [pdfUrl, isOpen]);

  // Extract table of contents from the first 8 pages of the PDF
  const extractTocFromPages = async (
    pdf: pdfjs.PDFDocumentProxy
  ): Promise<OutlineItem[]> => {
    const extractedToc: OutlineItem[] = [];
    const tocEntryPattern = /^([\w\s]+)(?:\s{2,}|\t+)(\d+)$/;
    const chapterPattern = /^(?:Chapter|Section)\s+\d+[\.:]\s+([\w\s]+)/i;

    // Process the first 8 pages (or fewer if the document is shorter)
    const pagesToCheck = Math.min(8, pdf.numPages);

    for (let i = 1; i <= pagesToCheck; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const items = textContent.items as PdfTextItem[];

      let currentChapter: OutlineItem | null = null;

      for (const item of items) {
        const text = item.str.trim();

        // Skip empty lines
        if (!text) continue;

        // Check if this is a chapter heading
        const chapterMatch = text.match(chapterPattern);
        if (chapterMatch) {
          currentChapter = {
            title: chapterMatch[1].trim(),
            dest: [{ num: i }],
            items: [],
          };
          extractedToc.push(currentChapter);
          continue;
        }

        // Check if this is a TOC entry (text followed by page number)
        const tocMatch = text.match(tocEntryPattern);
        if (tocMatch) {
          const entryTitle = tocMatch[1].trim();
          const pageNum = parseInt(tocMatch[2], 10);

          if (!isNaN(pageNum)) {
            const tocEntry = {
              title: entryTitle,
              dest: [{ num: pageNum }],
            };

            // If we have a current chapter, add as sub-item, otherwise add as top-level
            if (currentChapter && currentChapter.items) {
              currentChapter.items.push(tocEntry);
            } else {
              extractedToc.push(tocEntry);
            }
          }
        }
      }
    }

    return extractedToc;
  };

  // Process the PDF.js outline format to match our OutlineItem structure
  const processOutline = (
    outline: PdfOutlineItem[],
    pdf: pdfjs.PDFDocumentProxy
  ): OutlineItem[] => {
    return outline.map((item) => {
      const processedItem: OutlineItem = {
        title: item.title,
      };

      // Process destination to get page number
      if (item.dest) {
        const destArray = Array.isArray(item.dest) ? item.dest : [item.dest];
        const pageRef = destArray[0];

        if (typeof pageRef === "object" && pageRef !== null) {
          // If it's a reference, we need to resolve it
          const pageNum =
            typeof pageRef === "object" && "num" in pageRef
              ? (pageRef as { num: number }).num
              : 0;
          processedItem.dest = [{ num: pageNum }];
        } else if (typeof pageRef === "string") {
          // If it's a named destination, we would need to resolve it
          // This is simplified for now
          processedItem.dest = [{ num: 1 }];
        }
      }

      // Process child items recursively
      if (item.items && item.items.length > 0) {
        processedItem.items = processOutline(item.items, pdf);
      }

      return processedItem;
    });
  };

  // Generate an outline based on document content when no outline is available
  const generateOutlineFromContent = async (
    pdf: pdfjs.PDFDocumentProxy
  ): Promise<OutlineItem[]> => {
    const numPages = pdf.numPages;
    const generatedOutline: OutlineItem[] = [];

    // Process each page to find headings and structure
    for (let i = 1; i <= Math.min(numPages, 20); i++) {
      // Limit to first 20 pages for performance
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Extract text items that might be headings (larger font, bold, etc.)
      const items = textContent.items as PdfTextItem[];

      for (const item of items) {
        const text = item.str;
        const fontSize =
          item.height || (item.transform ? item.transform[3] : 0);

        // Simple heuristic: larger text might be headings
        if (fontSize > 14 && text.trim().length > 0 && text.length < 100) {
          // Check if this looks like a heading (not just a random large text)
          if (isLikelyHeading(text)) {
            generatedOutline.push({
              title: text.trim(),
              dest: [{ num: i }],
            });
          }
        }
      }
    }

    // If we couldn't generate anything meaningful, create a basic structure
    if (generatedOutline.length === 0) {
      // Create a basic outline with chapter estimates
      const chaptersEstimate = Math.max(1, Math.floor(numPages / 15));

      for (let i = 0; i < chaptersEstimate; i++) {
        const pageNum = Math.floor((i * numPages) / chaptersEstimate) + 1;
        generatedOutline.push({
          title: `Section ${i + 1}`,
          dest: [{ num: pageNum }],
        });
      }
    }

    return generatedOutline;
  };

  // Helper to determine if text is likely a heading
  const isLikelyHeading = (text: string): boolean => {
    // Remove common page elements that might be large but aren't headings
    if (
      text.match(/^[0-9]+$/) || // Just a number
      text.match(/page [0-9]+/i) || // Page number
      text.length > 60 || // Too long for a heading
      text.length < 3
    ) {
      // Too short to be meaningful
      return false;
    }

    // Check for patterns that suggest a heading
    const isHeading = !!(
      text.match(/^chapter [0-9]+/i) || // Chapter heading
      text.match(/^section [0-9]+/i) || // Section heading
      text.match(/^[0-9]+\.[0-9]+ /) || // Numbered heading like "1.2 Title"
      text.match(/^[IVX]+\. /) || // Roman numeral heading
      text.toUpperCase() === text || // ALL CAPS might be a heading
      text.match(/^[A-Z][a-z]+ [A-Z][a-z]+/) || // Title Case Words
      text.match(/^[A-Z][a-z]+$/) // Single Title Case Word
    );

    return isHeading;
  };

  const renderOutlineItem = (item: OutlineItem, level = 0) => {
    if (!item) return null;

    const pageNum = item.dest?.[0]?.num;

    return (
      <div key={`${item.title}-${level}-${pageNum}`} className="mb-1">
        <button
          className={`text-left w-full px-2 py-1 rounded hover:bg-blue-50 text-sm flex justify-between items-center text-black ${
            level === 0 ? "font-medium" : "font-normal"
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => pageNum && onPageSelect(pageNum)}
        >
          <span className={level === 0 ? "text-blue-800" : "text-black"}>
            {item.title}
          </span>
          {pageNum && (
            <span className="text-gray-500 text-xs ml-2">p.{pageNum}</span>
          )}
        </button>
        {item.items &&
          item.items.map((subItem) => renderOutlineItem(subItem, level + 1))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="border p-3 rounded-md bg-white max-h-[calc(100vh-300px)] overflow-y-auto shadow-md">
      <div className="flex justify-between items-center mb-3 pb-2 border-b">
        <h3 className="font-medium text-blue-900">Table of Contents</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <p className="text-sm text-red-500 p-2">{error}</p>
      ) : outline.length > 0 ? (
        <div className="space-y-1 text-black">
          {usedFactoryFiveToc && (
            <div className="mb-3 text-xs text-blue-600 italic px-2">
              Using Factory Five Mk5 Manual table of contents
            </div>
          )}
          {outline.map((item) => renderOutlineItem(item))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 p-2">
          No table of contents available
        </p>
      )}
    </div>
  );
}
