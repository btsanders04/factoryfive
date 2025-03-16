"use client";

import { useState, useMemo } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const enhancedPartsData = [
    // Initial Components
    {
        id: 1001,
        part: "Tubular Steel Frame (powder coated satin black)",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Chassis",
        category: "Initial Components",
        notes: "Satin black powder coating ($699 upgrade on order)",
        dependencies: [],
        estimatedInstallTime: "1-2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "27-30",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 1002,
        part: "Composite Body",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Body",
        category: "Initial Components",
        notes: "Pre-cut with requested openings ($149 upgrade on order)",
        dependencies: [1001],
        estimatedInstallTime: "4-6 hours",
        installDate: null,
        installDifficulty: "Hard",
        manualPageReference: "331-340",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 1003,
        part: "Laser-cut 6061-T6 Aluminum Panels",
        quantity: 66,
        quantityReceived: 0,
        status: "Not Received",
        section: "Various",
        category: "Initial Components",
        notes: "For cockpit, trunk, and engine bay panels",
        dependencies: [1001],
        estimatedInstallTime: "12-16 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "23-26, 118-167, 218-222",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 1004,
        part: "Pre-packaged Rivets (1/8\" and 3/16\")",
        quantity: 1200,
        quantityReceived: 0,
        status: "Not Received",
        section: "Various",
        category: "Initial Components",
        notes: "For aluminum panel installation",
        dependencies: [1003],
        estimatedInstallTime: "N/A",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "28-30",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 1005,
        part: "Certificate of Origin with Nameplate",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Documentation",
        category: "Initial Components",
        notes: "Important for registration",
        dependencies: [],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "15, 298-299",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },

    // Front Suspension
    {
        id: 2001,
        part: "Tubular Upper Control Arms",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Front Suspension",
        category: "Front Suspension",
        notes: "",
        dependencies: [1001],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "33-38",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 2002,
        part: "Tubular Lower Control Arms",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Front Suspension",
        category: "Front Suspension",
        notes: "",
        dependencies: [1001],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "31-33",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 2003,
        part: "Koni Coil-over Shocks (Front)",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Front Suspension",
        category: "Front Suspension",
        notes: "For standard width suspension package",
        dependencies: [2001, 2002],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "38-45",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 2004,
        part: "Front Springs (500 lb)",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Front Suspension",
        category: "Front Suspension",
        notes: "",
        dependencies: [2003],
        estimatedInstallTime: "Included with shocks",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "38-45",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 2005,
        part: "Upper Ball Joints",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Front Suspension",
        category: "Front Suspension",
        notes: "",
        dependencies: [2001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "33-38",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 2006,
        part: "Lower Ball Joints",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Front Suspension",
        category: "Front Suspension",
        notes: "",
        dependencies: [2002],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "31-33",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 2007,
        part: "Spindles (marked DSS/PSS)",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Front Suspension",
        category: "Front Suspension",
        notes: "Note that DSS mounts on passenger side, PSS on driver side for Roadster",
        dependencies: [2005, 2006],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "45-49",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 2008,
        part: "Front Wheel Hubs",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Front Suspension",
        category: "Front Suspension",
        notes: "",
        dependencies: [2007],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "48-49",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 2009,
        part: "Steering Arms",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Front Suspension",
        category: "Front Suspension",
        notes: "",
        dependencies: [2007],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "48",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 2010,
        part: "Grease Fittings",
        quantity: 12,
        quantityReceived: 0,
        status: "Not Received",
        section: "Front Suspension",
        category: "Front Suspension",
        notes: "For control arms, ball joints, and tie rod ends",
        dependencies: [2001, 2002],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "31-38",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },

    // Power Steering Components
    {
        id: 3001,
        part: "Power Steering Rack",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Steering System",
        category: "Power Steering Components",
        notes: "Power steering upgrade ($299)",
        dependencies: [1001],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "138-143",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 3002,
        part: "Power Steering Pump",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Steering System",
        category: "Power Steering Components",
        notes: "Included with power steering package",
        dependencies: [3001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "138-143",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 3003,
        part: "Power Steering Lines",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Steering System",
        category: "Power Steering Components",
        notes: "Set",
        dependencies: [3001, 3002],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "138-143",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 3004,
        part: "Steering Rack Mounting Hardware",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Steering System",
        category: "Power Steering Components",
        notes: "Set",
        dependencies: [3001],
        estimatedInstallTime: "Included with rack",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "138-143",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 3005,
        part: "Outer Tie Rod Ends",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Steering System",
        category: "Power Steering Components",
        notes: "",
        dependencies: [3001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "139-143",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 3006,
        part: "Steering Universal Joints",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Steering System",
        category: "Power Steering Components",
        notes: "",
        dependencies: [3001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "143-152",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 3007,
        part: "Nickel-Plated Lower Steering Shaft",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Steering System",
        category: "Power Steering Components",
        notes: "",
        dependencies: [3001, 3006],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "149-152",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 3008,
        part: "Upper Steering Shaft",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Steering System",
        category: "Power Steering Components",
        notes: "",
        dependencies: [3006, 3007],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "152-156",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 3009,
        part: "Steering Bearings",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Steering System",
        category: "Power Steering Components",
        notes: "",
        dependencies: [3008],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "143-149",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 3010,
        part: "Wood Steering Wheel",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Steering System",
        category: "Power Steering Components",
        notes: "",
        dependencies: [3008],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "316-317",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 3011,
        part: "Steering Boss",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Steering System",
        category: "Power Steering Components",
        notes: "",
        dependencies: [3010],
        estimatedInstallTime: "Included with wheel",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "316-317",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 3012,
        part: "Ceramic Factory Five Badge",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Steering System",
        category: "Power Steering Components",
        notes: "For steering wheel center",
        dependencies: [3010],
        estimatedInstallTime: "10 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "500-502",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },

    // IRS Rear Suspension
    {
        id: 4001,
        part: "IRS Center Section (with 3.55 gears)",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Rear Suspension",
        category: "IRS Rear Suspension",
        notes: "$1,750 upgraded component",
        dependencies: [1001],
        estimatedInstallTime: "3 hours",
        installDate: null,
        installDifficulty: "Hard",
        manualPageReference: "82-93",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 4002,
        part: "IRS Spindles",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Rear Suspension",
        category: "IRS Rear Suspension",
        notes: "Included with IRS package",
        dependencies: [4001],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "83-88",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 4003,
        part: "Upper Control Arms",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Rear Suspension",
        category: "IRS Rear Suspension",
        notes: "",
        dependencies: [1001, 4001],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "90-102",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 4004,
        part: "Lower Control Arms",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Rear Suspension",
        category: "IRS Rear Suspension",
        notes: "",
        dependencies: [1001, 4001],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "90-102",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 4005,
        part: "Toe Adjustment Arms",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Rear Suspension",
        category: "IRS Rear Suspension",
        notes: "",
        dependencies: [1001, 4001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "92, 98-99",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 4006,
        part: "CV Axles",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Rear Suspension",
        category: "IRS Rear Suspension",
        notes: "",
        dependencies: [4001, 4002],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "101-102",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 4007,
        part: "Koni Coil-over Shocks (Rear)",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Rear Suspension",
        category: "IRS Rear Suspension",
        notes: "",
        dependencies: [4003, 4004],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "107-113",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 4008,
        part: "Rear Springs (400 lb)",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Rear Suspension",
        category: "IRS Rear Suspension",
        notes: "",
        dependencies: [4007],
        estimatedInstallTime: "Included with shocks",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "107-113",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 4009,
        part: "Polyurethane Bushings",
        quantity: 16,
        quantityReceived: 0,
        status: "Not Received",
        section: "Rear Suspension",
        category: "IRS Rear Suspension",
        notes: "Various sizes",
        dependencies: [4003, 4004, 4005],
        estimatedInstallTime: "Included with arms",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "88-92",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 4010,
        part: "Mounting Hardware",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Rear Suspension",
        category: "IRS Rear Suspension",
        notes: "Set",
        dependencies: [4001, 4002, 4003, 4004, 4005],
        estimatedInstallTime: "Included with components",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "92-117",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },

    // Brake System
    {
        id: 5001,
        part: "Wilwood 12.88\" Front Brakes (Red)",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Front Brakes",
        category: "Brake System",
        notes: "$1,850 upgraded front brakes",
        dependencies: [2008],
        estimatedInstallTime: "3 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "49-58",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 5002,
        part: "Wilwood Rear Brakes for IRS (Red)",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Rear Brakes",
        category: "Brake System",
        notes: "$2,299 upgraded rear brakes",
        dependencies: [4002],
        estimatedInstallTime: "3 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "113",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 5003,
        part: "Wilwood Pedal Assembly",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Pedal Box",
        category: "Brake System",
        notes: "",
        dependencies: [1001],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "120-132",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 5004,
        part: "Master Cylinders",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Pedal Box",
        category: "Brake System",
        notes: "",
        dependencies: [5003],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "129-132",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 5005,
        part: "Brake Lines (3/16\")",
        quantity: 12,
        quantityReceived: 0,
        status: "Not Received",
        section: "Brake System",
        category: "Brake System",
        notes: "Various lengths",
        dependencies: [5003, 5004],
        estimatedInstallTime: "4 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "192-215",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 5006,
        part: "Brake Line Fittings",
        quantity: 20,
        quantityReceived: 0,
        status: "Not Received",
        section: "Brake System",
        category: "Brake System",
        notes: "Various types",
        dependencies: [5005],
        estimatedInstallTime: "Included with lines",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "192-215",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 5007,
        part: "Brake Reservoirs",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Brake System",
        category: "Brake System",
        notes: "",
        dependencies: [5004],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "192-200",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 5008,
        part: "Brake Line Clips",
        quantity: 24,
        quantityReceived: 0,
        status: "Not Received",
        section: "Brake System",
        category: "Brake System",
        notes: "",
        dependencies: [5005],
        estimatedInstallTime: "Included with lines",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "204-215",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 5009,
        part: "Flexible Brake Hoses",
        quantity: 4,
        quantityReceived: 0,
        status: "Not Received",
        section: "Brake System",
        category: "Brake System",
        notes: "",
        dependencies: [5001, 5002, 5005],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "200-215",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 5010,
        part: "Emergency Brake Handle",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Emergency Brake",
        category: "Brake System",
        notes: "",
        dependencies: [1001],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "266-281",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 5011,
        part: "E-Brake Cables",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Emergency Brake",
        category: "Brake System",
        notes: "",
        dependencies: [5010, 5002],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "281-284",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },

    // Fuel System
    {
        id: 6001,
        part: "Fuel Tank",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Fuel System",
        category: "Fuel System",
        notes: "",
        dependencies: [1001],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "168-185",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 6002,
        part: "In-Tank EFI Fuel System",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Fuel System",
        category: "Fuel System",
        notes: "$645 upgrade",
        dependencies: [6001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "173-179",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 6003,
        part: "Fuel Tank Mounting Hardware",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Fuel System",
        category: "Fuel System",
        notes: "Set",
        dependencies: [6001],
        estimatedInstallTime: "Included with tank",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "168-185",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 6004,
        part: "Fuel Level Sending Unit",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Fuel System",
        category: "Fuel System",
        notes: "",
        dependencies: [6001],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "179-181",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 6005,
        part: "Fuel Filler Neck",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Fuel System",
        category: "Fuel System",
        notes: "",
        dependencies: [6001],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "181-183",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 6006,
        part: "Polished Aston Lemans Aluminum Fuel Cap",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Fuel System",
        category: "Fuel System",
        notes: "",
        dependencies: [1002, 6005],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "402-405, 458-459",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 6007,
        part: "Fuel Lines (1/4\" and 5/16\")",
        quantity: 6,
        quantityReceived: 0,
        status: "Not Received",
        section: "Fuel System",
        category: "Fuel System",
        notes: "Various lengths",
        dependencies: [6001, 6002],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "188-191",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 6008,
        part: "Fuel Line Fittings",
        quantity: 12,
        quantityReceived: 0,
        status: "Not Received",
        section: "Fuel System",
        category: "Fuel System",
        notes: "Various types",
        dependencies: [6007],
        estimatedInstallTime: "Included with lines",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "188-191",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 6009,
        part: "Fuel Filter",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Fuel System",
        category: "Fuel System",
        notes: "",
        dependencies: [6007],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "185-188",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },

    // Cooling System
    {
        id: 7001,
        part: "Aluminum Radiator",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Cooling System",
        category: "Cooling System",
        notes: "",
        dependencies: [1001, 1002],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "250-256",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 7002,
        part: "Electric Cooling Fan",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Cooling System",
        category: "Cooling System",
        notes: "",
        dependencies: [7001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "250-254",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 7003,
        part: "Fan Mounting Hardware",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Cooling System",
        category: "Cooling System",
        notes: "Set",
        dependencies: [7002],
        estimatedInstallTime: "Included with fan",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "250-254",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 7004,
        part: "Stainless Steel Radiator Hose Kit",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Cooling System",
        category: "Cooling System",
        notes: "",
        dependencies: [7001],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "256-261",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 7005,
        part: "Radiator Cap",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Cooling System",
        category: "Cooling System",
        notes: "",
        dependencies: [7001],
        estimatedInstallTime: "5 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "263",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 7006,
        part: "Overflow Tank",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Cooling System",
        category: "Cooling System",
        notes: "",
        dependencies: [7001],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "261-263",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 7007,
        part: "185° Thermostat Switch",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Cooling System",
        category: "Cooling System",
        notes: "For fan activation",
        dependencies: [7002],
        estimatedInstallTime: "15 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "263-264",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },

    // Engine & Exhaust
    {
        id: 8001,
        part: "351W Engine Mounts",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Engine Installation",
        category: "Engine & Exhaust",
        notes: "Set",
        dependencies: [1001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "224-228",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 8002,
        part: "351W Headers",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Exhaust System",
        category: "Engine & Exhaust",
        notes: "$799 upgrade",
        dependencies: [8001],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "238-240",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 8003,
        part: "Side Exhaust System",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Exhaust System",
        category: "Engine & Exhaust",
        notes: "$999 upgrade",
        dependencies: [8002, 1002],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "502-507",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 8004,
        part: "31-Spline Driveshaft (8.38\")",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Drivetrain",
        category: "Engine & Exhaust",
        notes: "For TKO/TKX transmission",
        dependencies: [8001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "290-292",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 8005,
        part: "Hydraulic Clutch Master Cylinder Kit",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Pedal Box",
        category: "Engine & Exhaust",
        notes: "$140 upgrade",
        dependencies: [5003],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "129-132",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },

    // Electrical Components
    {
        id: 9001,
        part: "Custom Chassis Wiring Harness",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Electrical System",
        category: "Electrical Components",
        notes: "",
        dependencies: [1001],
        estimatedInstallTime: "6 hours",
        installDate: null,
        installDifficulty: "Hard",
        manualPageReference: "218",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 9002,
        part: "Ignition Switch",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Dash/Gauges",
        category: "Electrical Components",
        notes: "",
        dependencies: [9001],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "299-310",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 9003,
        part: "Headlight Switch",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Dash/Gauges",
        category: "Electrical Components",
        notes: "",
        dependencies: [9001],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "299-310",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 9004,
        part: "Hi-Low Beam Switch",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Dash/Gauges",
        category: "Electrical Components",
        notes: "",
        dependencies: [9001],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "299-310",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 9005,
        part: "Starter Solenoid",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Electrical System",
        category: "Electrical Components",
        notes: "",
        dependencies: [9001],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "232-238",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 9006,
        part: "Horn Button",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Dash/Gauges",
        category: "Electrical Components",
        notes: "",
        dependencies: [9001, 3010],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "310-316",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 9007,
        part: "Dash Indicator Lights",
        quantity: 6,
        quantityReceived: 0,
        status: "Not Received",
        section: "Dash/Gauges",
        category: "Electrical Components",
        notes: "Set",
        dependencies: [9001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "299-310",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 9008,
        part: "Battery Cables/Ground Strap",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Electrical System",
        category: "Electrical Components",
        notes: "Set",
        dependencies: [9001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "232-238",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 9009,
        part: "Speedometer Sending Unit",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Electrical System",
        category: "Electrical Components",
        notes: "",
        dependencies: [9001],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "264-266",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 9010,
        part: "Vintage GPS 7-Gauge Set",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Dash/Gauges",
        category: "Electrical Components",
        notes: "$550 upgrade",
        dependencies: [9001],
        estimatedInstallTime: "3 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "299-310",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 9011,
        part: "4-Way Battery Cut-Off Switch",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Electrical System",
        category: "Electrical Components",
        notes: "",
        dependencies: [9001, 9008],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "",
        image: null,
        location: null,
        isOptional: true,
        inspectionNotes: ""
    },

    // Interior Components
    {
        id: 10001,
        part: "Black Leather Seats",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Interior",
        category: "Interior Components",
        notes: "$775 upgrade",
        dependencies: [1001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "296-298",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 10002,
        part: "5-Point Harnesses (2\")",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Interior",
        category: "Interior Components",
        notes: "",
        dependencies: [10001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "439-446",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 10003,
        part: "Carpet Set",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Interior",
        category: "Interior Components",
        notes: "",
        dependencies: [1003],
        estimatedInstallTime: "4 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "428-439",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 10004,
        part: "Emergency Brake Boot",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Interior",
        category: "Interior Components",
        notes: "",
        dependencies: [5010, 10003],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "441-443",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 10005,
        part: "Interior Rearview Mirror",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Interior",
        category: "Interior Components",
        notes: "",
        dependencies: [1002],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "481-485",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 10006,
        part: "Door Latches",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Doors",
        category: "Interior Components",
        notes: "",
        dependencies: [1002],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "382-385",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 10007,
        part: "Aluminum Dash with Vinyl",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Dash/Gauges",
        category: "Interior Components",
        notes: "",
        dependencies: [1001, 9010],
        estimatedInstallTime: "3 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "299-310",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 10008,
        part: "Shifter Boot",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Interior",
        category: "Interior Components",
        notes: "",
        dependencies: [10003],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "446-450",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 10009,
        part: "Seat Tracks",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Interior",
        category: "Interior Components",
        notes: "",
        dependencies: [10001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "296-298",
        image: null,
        location: null,
        isOptional: true,
        inspectionNotes: ""
    },
    {
        id: 10010,
        part: "A/C System Components",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "A/C System",
        category: "Interior Components",
        notes: "$1,475 upgrade",
        dependencies: [1001, 8001],
        estimatedInstallTime: "6 hours",
        installDate: null,
        installDifficulty: "Hard",
        manualPageReference: "",
        image: null,
        location: null,
        isOptional: true,
        inspectionNotes: ""
    },
    {
        id: 10011,
        part: "Sun Visor Set",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Interior",
        category: "Interior Components",
        notes: "$125 upgrade",
        dependencies: [1002],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "",
        image: null,
        location: null,
        isOptional: true,
        inspectionNotes: ""
    },

    // Exterior Components
    {
        id: 11001,
        part: "DOT Approved Windshield",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Windshield",
        category: "Exterior Components",
        notes: "",
        dependencies: [1002],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "373-377",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 11002,
        part: "Wind Wing Set",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Windshield",
        category: "Exterior Components",
        notes: "",
        dependencies: [11001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "",
        image: null,
        location: null,
        isOptional: true,
        inspectionNotes: ""
    },
    {
        id: 11003,
        part: "DOT Approved Headlights",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Exterior Lights",
        category: "Exterior Components",
        notes: "",
        dependencies: [1002, 9001],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "413-415, 450-456",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 11004,
        part: "Turn Signals",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Exterior Lights",
        category: "Exterior Components",
        notes: "",
        dependencies: [1002, 9001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "406-408, 456-457",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 11005,
        part: "Taillights",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Exterior Lights",
        category: "Exterior Components",
        notes: "",
        dependencies: [1002, 9001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "406, 457",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 11006,
        part: "License Plate Light and Bracket",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Exterior Lights",
        category: "Exterior Components",
        notes: "",
        dependencies: [1002, 9001],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "408-411",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 11007,
        part: "GT400 Polished Side Mirrors",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Exterior",
        category: "Exterior Components",
        notes: "Driver side included, passenger side is $59 upgrade",
        dependencies: [1002],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "397-401, 493-494",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 11008,
        part: "Hood Hinges with Supports",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Hood",
        category: "Exterior Components",
        notes: "Set",
        dependencies: [1002],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "343-351",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 11009,
        part: "Plastic Hood Scoop",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Hood",
        category: "Exterior Components",
        notes: "",
        dependencies: [1002],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "357-373",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 11010,
        part: "Hidden Trunk Hinge Kit",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Trunk",
        category: "Exterior Components",
        notes: "",
        dependencies: [1002],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "386-388",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
     {
        id: 11011,
        part: "Trunk Gas Strut Kit",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Trunk",
        category: "Exterior Components",
        notes: "",
        dependencies: [11010],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "462-466",
        image: null,
        location: null,
        isOptional: true,
        inspectionNotes: ""
    },
    {
        id: 11012,
        part: "Chrome Rollbar",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Safety",
        category: "Exterior Components",
        notes: "$499 upgrade",
        dependencies: [1001, 1002],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "317-322, 417-423",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 11013,
        part: "1.50\" Rollbar Grommet Set",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Safety",
        category: "Exterior Components",
        notes: "$94 upgrade",
        dependencies: [11012],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "423-424",
        image: null,
        location: null,
        isOptional: true,
        inspectionNotes: ""
    },
    {
        id: 11014,
        part: "Side Louvers",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Body",
        category: "Exterior Components",
        notes: "",
        dependencies: [1002],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "415-417, 460-462",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 11015,
        part: "Brake Duct Wire Mesh Set",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Body",
        category: "Exterior Components",
        notes: "",
        dependencies: [1002],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "",
        image: null,
        location: null,
        isOptional: true,
        inspectionNotes: ""
    },
    {
        id: 11016,
        part: "Factory Five Nose and Tail Badges",
        quantity: 2,
        quantityReceived: 0,
        status: "Not Received",
        section: "Exterior",
        category: "Exterior Components",
        notes: "",
        dependencies: [1002],
        estimatedInstallTime: "30 minutes",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },

    // Wheels and Tires
    {
        id: 12001,
        part: "18\" Halibrand Style Wheels",
        quantity: 4,
        quantityReceived: 0,
        status: "Not Received",
        section: "Wheels/Tires",
        category: "Wheels and Tires",
        notes: "Part of $3,699 wheel/tire package",
        dependencies: [2008, 4002],
        estimatedInstallTime: "1 hour",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "518-519",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 12002,
        part: "Tires",
        quantity: 4,
        quantityReceived: 0,
        status: "Not Received",
        section: "Wheels/Tires",
        category: "Wheels and Tires",
        notes: "Part of $3,699 wheel/tire package",
        dependencies: [12001],
        estimatedInstallTime: "Included with wheels",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "518-519",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 12003,
        part: "Lug Nuts",
        quantity: 20,
        quantityReceived: 0,
        status: "Not Received",
        section: "Wheels/Tires",
        category: "Wheels and Tires",
        notes: "5 per wheel",
        dependencies: [12001],
        estimatedInstallTime: "Included with wheels",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "518-519",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },

    // Fasteners and Hardware
    {
        id: 13001,
        part: "Zinc Plated Fasteners",
        quantity: 1600,
        quantityReceived: 0,
        status: "Not Received",
        section: "Various",
        category: "Fasteners and Hardware",
        notes: "Various sizes",
        dependencies: [],
        estimatedInstallTime: "N/A",
        installDate: null,
        installDifficulty: "N/A",
        manualPageReference: "538",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 13002,
        part: "Chrome and Stainless Steel Fasteners",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Various",
        category: "Fasteners and Hardware",
        notes: "Various types",
        dependencies: [],
        estimatedInstallTime: "N/A",
        installDate: null,
        installDifficulty: "N/A",
        manualPageReference: "538",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 13003,
        part: "Quick-Jack Components",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Body Mounting",
        category: "Fasteners and Hardware",
        notes: "Set",
        dependencies: [1001, 1002],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Medium",
        manualPageReference: "334-340",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 13004,
        part: "Weatherstripping",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Body Mounting",
        category: "Fasteners and Hardware",
        notes: "Various types",
        dependencies: [1001, 1002],
        estimatedInstallTime: "2 hours",
        installDate: null,
        installDifficulty: "Easy",
        manualPageReference: "466-469",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },

    // Documentation
    {
        id: 14001,
        part: "Assembly Manual",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Documentation",
        category: "Documentation",
        notes: "",
        dependencies: [],
        estimatedInstallTime: "N/A",
        installDate: null,
        installDifficulty: "N/A",
        manualPageReference: "N/A",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    },
    {
        id: 14002,
        part: "Wiring Diagrams",
        quantity: 1,
        quantityReceived: 0,
        status: "Not Received",
        section: "Documentation",
        category: "Documentation",
        notes: "Set",
        dependencies: [],
        estimatedInstallTime: "N/A",
        installDate: null,
        installDifficulty: "N/A",
        manualPageReference: "N/A",
        image: null,
        location: null,
        isOptional: false,
        inspectionNotes: ""
    }
];

// Define the type for our parts data
type Part = {
  id: number;
  part: string;
  quantity: number;
  quantityReceived: number;
  status: string;
  section: string;
  category: string;
  notes: string;
  dependencies: number[];
  estimatedInstallTime: string;
  installDate: string | null;
  installDifficulty: string;
  manualPageReference: string;
  image: string | null;
  location: string | null;
  isOptional: boolean;
  inspectionNotes: string;
};
function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let className = "";

  switch (status) {
    case "Received":
      // Custom success style since it's not in your variants
      variant = "outline";
      className =
        "border-green-400 bg-green-100 text-green-800 hover:bg-green-200";
      break;
    case "Installed":
      variant = "default";
      break;
    case "Damaged":
      variant = "destructive";
      break;
    case "Missing":
      // Custom warning style
      variant = "outline";
      className =
        "border-yellow-400 bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      break;
    case "Not Received":
      variant = "outline";
      break;
  }

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}

// Custom badge for difficulty
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let className = "";

  switch (difficulty) {
    case "Easy":
      variant = "outline";
      className = "border-green-400 bg-green-50 text-green-700";
      break;
    case "Medium":
      variant = "secondary";
      break;
    case "Hard":
      variant = "destructive";
      break;
    case "N/A":
      variant = "outline";
      break;
  }

  return (
    <Badge variant={variant} className={className}>
      {difficulty}
    </Badge>
  );
}

// Detailed part dialog component
function PartDetailDialog({
  part,
  isOpen,
  setIsOpen,
  onUpdate,
}: {
  part: Part;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onUpdate: (part: Part) => void;
}) {
  const [editedPart, setEditedPart] = useState<Part>({ ...part });

  const handleStatusChange = (value: string) => {
    setEditedPart({ ...editedPart, status: value });
  };

  const handleQuantityReceivedChange = (value: number) => {
    setEditedPart({ ...editedPart, quantityReceived: value });
  };

  const handleLocationChange = (value: string) => {
    setEditedPart({ ...editedPart, location: value });
  };

  const handleInspectionNotesChange = (value: string) => {
    setEditedPart({ ...editedPart, inspectionNotes: value });
  };

  const handleSave = () => {
    onUpdate(editedPart);
    setIsOpen(false);
  };

  // Get dependent parts
  const dependentParts = useMemo(() => {
    return enhancedPartsData.filter((p) =>
      editedPart.dependencies.includes(p.id)
    );
  }, [editedPart.dependencies]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editedPart.part}</DialogTitle>
          <DialogDescription>ID: {editedPart.id}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="installation">Installation</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium">Section</h4>
                <p className="text-sm text-gray-500">{editedPart.section}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Category</h4>
                <p className="text-sm text-gray-500">{editedPart.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Manual Reference</h4>
                <p className="text-sm text-gray-500">
                  {editedPart.manualPageReference || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Difficulty</h4>
                <div className="mt-1">
                  <DifficultyBadge difficulty={editedPart.installDifficulty} />
                </div>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium">Notes</h4>
                <p className="text-sm text-gray-500">
                  {editedPart.notes || "No notes available"}
                </p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium">Estimated Install Time</h4>
                <p className="text-sm text-gray-500">
                  {editedPart.estimatedInstallTime}
                </p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium">Optional</h4>
                <p className="text-sm text-gray-500">
                  {editedPart.isOptional ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dependencies">
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Dependencies</h4>
              {dependentParts.length === 0 ? (
                <p className="text-sm text-gray-500">No dependencies</p>
              ) : (
                <div className="space-y-2">
                  {dependentParts.map((depPart) => (
                    <div
                      key={depPart.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium">{depPart.part}</p>
                        <p className="text-sm text-gray-500">
                          {depPart.section}
                        </p>
                      </div>
                      <StatusBadge status={depPart.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Quantity Required
                  </label>
                  <Input
                    value={editedPart.quantity}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Quantity Received
                  </label>
                  <Input
                    type="number"
                    value={editedPart.quantityReceived}
                    onChange={(e) =>
                      handleQuantityReceivedChange(
                        parseInt(e.target.value) || 0
                      )
                    }
                    min={0}
                    max={editedPart.quantity}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={editedPart.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Received">Not Received</SelectItem>
                      <SelectItem value="Received">Received</SelectItem>
                      <SelectItem value="Installed">Installed</SelectItem>
                      <SelectItem value="Damaged">Damaged</SelectItem>
                      <SelectItem value="Missing">Missing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Storage Location
                  </label>
                  <Input
                    value={editedPart.location || ""}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    placeholder="Where is this part stored?"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Inspection Notes</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded resize-y min-h-[100px]"
                  value={editedPart.inspectionNotes || ""}
                  onChange={(e) => handleInspectionNotesChange(e.target.value)}
                  placeholder="Enter inspection notes here..."
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="installation">
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">
                    Estimated Install Time
                  </h4>
                  <p className="text-sm text-gray-500">
                    {editedPart.estimatedInstallTime}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Install Difficulty</h4>
                  <div className="mt-1">
                    <DifficultyBadge
                      difficulty={editedPart.installDifficulty}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Install Date</h4>
                  <p className="text-sm text-gray-500">
                    {editedPart.installDate || "Not installed"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Manual Reference</h4>
                  <p className="text-sm text-gray-500">
                    {editedPart.manualPageReference || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PartsInventory() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sectionFilter, setSectionFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [partsData, setPartsData] = useState<Part[]>(enhancedPartsData);

  // Get unique categories and sections for filters
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(enhancedPartsData.map((part) => part.category))
    );
    return ["All", ...uniqueCategories];
  }, []);

  const sections = useMemo(() => {
    const uniqueSections = Array.from(
      new Set(enhancedPartsData.map((part) => part.section))
    );
    return ["All", ...uniqueSections];
  }, []);

  // Calculate completion metrics
  const metrics = useMemo(() => {
    const totalParts = partsData.length;
    const receivedParts = partsData.filter(
      (p) => p.status === "Received" || p.status === "Installed"
    ).length;
    const installedParts = partsData.filter(
      (p) => p.status === "Installed"
    ).length;

    return {
      totalParts,
      receivedParts,
      installedParts,
      receivedPercentage: Math.round((receivedParts / totalParts) * 100),
      installedPercentage: Math.round((installedParts / totalParts) * 100),
    };
  }, [partsData]);

  // Filter parts based on category, section, status and search query
  const filteredParts = useMemo(() => {
    return partsData.filter((part) => {
      const matchesCategory =
        categoryFilter === "All" || part.category === categoryFilter;
      const matchesSection =
        sectionFilter === "All" || part.section === sectionFilter;
      const matchesStatus =
        statusFilter === "All" || part.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        part.part.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.notes.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        matchesCategory && matchesSection && matchesStatus && matchesSearch
      );
    });
  }, [partsData, categoryFilter, sectionFilter, statusFilter, searchQuery]);

  // Update part data
  const handleUpdatePart = (updatedPart: Part) => {
    setPartsData(
      partsData.map((part) => (part.id === updatedPart.id ? updatedPart : part))
    );
  };

  // Define table columns
  const columns: ColumnDef<Part>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="text-right">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "part",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Part
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isOptional = row.original.isOptional;
        return (
          <div className="flex items-center">
            <span className={isOptional ? "text-gray-500 italic" : ""}>
              {row.getValue("part")}
              {isOptional && <span className="ml-2 text-xs">(Optional)</span>}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "section",
      header: "Section",
      cell: ({ row }) => <div>{row.getValue("section")}</div>,
    },
    {
      accessorKey: "quantity",
      header: "Qty",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.quantityReceived}/{row.getValue("quantity")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "installDifficulty",
      header: "Difficulty",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DifficultyBadge difficulty={row.getValue("installDifficulty")} />
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const part = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedPart(part);
                  setIsDetailOpen(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const updated = { ...part, status: "Received" };
                  handleUpdatePart(updated);
                }}
              >
                Mark as Received
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const updated = {
                    ...part,
                    status: "Installed",
                    installDate: new Date().toISOString(),
                  };
                  handleUpdatePart(updated);
                }}
              >
                Mark as Installed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredParts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>MK5 Roadster Build Progress</CardTitle>
          <CardDescription>
            Track your parts inventory and installation progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Parts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalParts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Parts Received
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.receivedParts}
                </div>
                <Progress className="mt-2" value={metrics.receivedPercentage} />
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.receivedPercentage}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Parts Installed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.installedParts}
                </div>
                <Progress
                  className="mt-2"
                  value={metrics.installedPercentage}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.installedPercentage}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Parts Ready to Install
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.receivedParts - metrics.installedParts}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parts Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Not Received">Not Received</SelectItem>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Installed">Installed</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                  <SelectItem value="Missing">Missing</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                        setSelectedPart(row.original);
                        setIsDetailOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedPart && (
        <PartDetailDialog
          part={selectedPart}
          isOpen={isDetailOpen}
          setIsOpen={setIsDetailOpen}
          onUpdate={handleUpdatePart}
        />
      )}
    </div>
  );
}
