"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const PartsInventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Parse the parts data from the text file
  const partsData = [
    // Initial Components
    {
      part: "Tubular Steel Frame (powder coated satin black)",
      quantity: 1,
      section: "Chassis",
      category: "Initial Components",
    },
    {
      part: "Composite Body",
      quantity: 1,
      section: "Body",
      category: "Initial Components",
    },
    {
      part: "Laser-cut 6061-T6 Aluminum Panels",
      quantity: "~66 pieces",
      section: "Various",
      category: "Initial Components",
    },
    {
      part: 'Pre-packaged Rivets (1/8" and 3/16")',
      quantity: "~1200",
      section: "Various",
      category: "Initial Components",
    },
    {
      part: "Certificate of Origin with Nameplate",
      quantity: 1,
      section: "Documentation",
      category: "Initial Components",
    },

    // Front Suspension
    {
      part: "Tubular Upper Control Arms",
      quantity: 2,
      section: "Front Suspension",
      category: "Front Suspension",
    },
    {
      part: "Tubular Lower Control Arms",
      quantity: 2,
      section: "Front Suspension",
      category: "Front Suspension",
    },
    {
      part: "Koni Coil-over Shocks (Front)",
      quantity: 2,
      section: "Front Suspension",
      category: "Front Suspension",
    },
    {
      part: "Front Springs (500 lb)",
      quantity: 2,
      section: "Front Suspension",
      category: "Front Suspension",
    },
    {
      part: "Upper Ball Joints",
      quantity: 2,
      section: "Front Suspension",
      category: "Front Suspension",
    },
    {
      part: "Lower Ball Joints",
      quantity: 2,
      section: "Front Suspension",
      category: "Front Suspension",
    },
    {
      part: "Spindles (marked DSS/PSS)",
      quantity: 2,
      section: "Front Suspension",
      category: "Front Suspension",
    },
    {
      part: "Front Wheel Hubs",
      quantity: 2,
      section: "Front Suspension",
      category: "Front Suspension",
    },
    {
      part: "Steering Arms",
      quantity: 2,
      section: "Front Suspension",
      category: "Front Suspension",
    },
    {
      part: "Grease Fittings",
      quantity: "Multiple",
      section: "Front Suspension",
      category: "Front Suspension",
    },

    // Power Steering Components
    {
      part: "Power Steering Rack",
      quantity: 1,
      section: "Steering System",
      category: "Power Steering Components",
    },
    {
      part: "Power Steering Pump",
      quantity: 1,
      section: "Steering System",
      category: "Power Steering Components",
    },
    {
      part: "Power Steering Lines",
      quantity: "Set",
      section: "Steering System",
      category: "Power Steering Components",
    },
    {
      part: "Steering Rack Mounting Hardware",
      quantity: "Set",
      section: "Steering System",
      category: "Power Steering Components",
    },
    {
      part: "Outer Tie Rod Ends",
      quantity: 2,
      section: "Steering System",
      category: "Power Steering Components",
    },
    {
      part: "Steering Universal Joints",
      quantity: 2,
      section: "Steering System",
      category: "Power Steering Components",
    },
    {
      part: "Nickel-Plated Lower Steering Shaft",
      quantity: 1,
      section: "Steering System",
      category: "Power Steering Components",
    },
    {
      part: "Upper Steering Shaft",
      quantity: 1,
      section: "Steering System",
      category: "Power Steering Components",
    },
    {
      part: "Steering Bearings",
      quantity: 2,
      section: "Steering System",
      category: "Power Steering Components",
    },
    {
      part: "Wood Steering Wheel",
      quantity: 1,
      section: "Steering System",
      category: "Power Steering Components",
    },
    {
      part: "Steering Boss",
      quantity: 1,
      section: "Steering System",
      category: "Power Steering Components",
    },
    {
      part: "Ceramic Factory Five Badge",
      quantity: 1,
      section: "Steering System",
      category: "Power Steering Components",
    },

    // IRS Rear Suspension
    {
      part: "IRS Center Section (with 3.55 gears)",
      quantity: 1,
      section: "Rear Suspension",
      category: "IRS Rear Suspension",
    },
    {
      part: "IRS Spindles",
      quantity: 2,
      section: "Rear Suspension",
      category: "IRS Rear Suspension",
    },
    {
      part: "Upper Control Arms",
      quantity: 2,
      section: "Rear Suspension",
      category: "IRS Rear Suspension",
    },
    {
      part: "Lower Control Arms",
      quantity: 2,
      section: "Rear Suspension",
      category: "IRS Rear Suspension",
    },
    {
      part: "Toe Adjustment Arms",
      quantity: 2,
      section: "Rear Suspension",
      category: "IRS Rear Suspension",
    },
    {
      part: "CV Axles",
      quantity: 2,
      section: "Rear Suspension",
      category: "IRS Rear Suspension",
    },
    {
      part: "Koni Coil-over Shocks (Rear)",
      quantity: 2,
      section: "Rear Suspension",
      category: "IRS Rear Suspension",
    },
    {
      part: "Rear Springs (400 lb)",
      quantity: 2,
      section: "Rear Suspension",
      category: "IRS Rear Suspension",
    },
    {
      part: "Polyurethane Bushings",
      quantity: "Multiple",
      section: "Rear Suspension",
      category: "IRS Rear Suspension",
    },
    {
      part: "Mounting Hardware",
      quantity: "Set",
      section: "Rear Suspension",
      category: "IRS Rear Suspension",
    },

    // Brake System
    {
      part: 'Wilwood 12.88" Front Brakes (Red)',
      quantity: 2,
      section: "Front Brakes",
      category: "Brake System",
    },
    {
      part: "Wilwood Rear Brakes for IRS (Red)",
      quantity: 2,
      section: "Rear Brakes",
      category: "Brake System",
    },
    {
      part: "Wilwood Pedal Assembly",
      quantity: 1,
      section: "Pedal Box",
      category: "Brake System",
    },
    {
      part: "Master Cylinders",
      quantity: 2,
      section: "Pedal Box",
      category: "Brake System",
    },
    {
      part: 'Brake Lines (3/16")',
      quantity: "Multiple",
      section: "Brake System",
      category: "Brake System",
    },
    {
      part: "Brake Line Fittings",
      quantity: "Multiple",
      section: "Brake System",
      category: "Brake System",
    },
    {
      part: "Brake Reservoirs",
      quantity: 2,
      section: "Brake System",
      category: "Brake System",
    },
    {
      part: "Brake Line Clips",
      quantity: "Multiple",
      section: "Brake System",
      category: "Brake System",
    },
    {
      part: "Flexible Brake Hoses",
      quantity: 4,
      section: "Brake System",
      category: "Brake System",
    },
    {
      part: "Emergency Brake Handle",
      quantity: 1,
      section: "Emergency Brake",
      category: "Brake System",
    },
    {
      part: "E-Brake Cables",
      quantity: 2,
      section: "Emergency Brake",
      category: "Brake System",
    },

    // Fuel System
    {
      part: "Fuel Tank",
      quantity: 1,
      section: "Fuel System",
      category: "Fuel System",
    },
    {
      part: "In-Tank EFI Fuel System",
      quantity: 1,
      section: "Fuel System",
      category: "Fuel System",
    },
    {
      part: "Fuel Tank Mounting Hardware",
      quantity: "Set",
      section: "Fuel System",
      category: "Fuel System",
    },
    {
      part: "Fuel Level Sending Unit",
      quantity: 1,
      section: "Fuel System",
      category: "Fuel System",
    },
    {
      part: "Fuel Filler Neck",
      quantity: 1,
      section: "Fuel System",
      category: "Fuel System",
    },
    {
      part: "Polished Aston Lemans Aluminum Fuel Cap",
      quantity: 1,
      section: "Fuel System",
      category: "Fuel System",
    },
    {
      part: 'Fuel Lines (1/4" and 5/16")',
      quantity: "Multiple",
      section: "Fuel System",
      category: "Fuel System",
    },
    {
      part: "Fuel Line Fittings",
      quantity: "Multiple",
      section: "Fuel System",
      category: "Fuel System",
    },
    {
      part: "Fuel Filter",
      quantity: 1,
      section: "Fuel System",
      category: "Fuel System",
    },

    // Cooling System
    {
      part: "Aluminum Radiator",
      quantity: 1,
      section: "Cooling System",
      category: "Cooling System",
    },
    {
      part: "Electric Cooling Fan",
      quantity: 1,
      section: "Cooling System",
      category: "Cooling System",
    },
    {
      part: "Fan Mounting Hardware",
      quantity: "Set",
      section: "Cooling System",
      category: "Cooling System",
    },
    {
      part: "Stainless Steel Radiator Hose Kit",
      quantity: 1,
      section: "Cooling System",
      category: "Cooling System",
    },
    {
      part: "Radiator Cap",
      quantity: 1,
      section: "Cooling System",
      category: "Cooling System",
    },
    {
      part: "Overflow Tank",
      quantity: 1,
      section: "Cooling System",
      category: "Cooling System",
    },
    {
      part: "185° Thermostat Switch",
      quantity: 1,
      section: "Cooling System",
      category: "Cooling System",
    },

    // Engine & Exhaust
    {
      part: "351W Engine Mounts",
      quantity: "Set",
      section: "Engine Installation",
      category: "Engine & Exhaust",
    },
    {
      part: "351W Headers",
      quantity: "1 Set",
      section: "Exhaust System",
      category: "Engine & Exhaust",
    },
    {
      part: "Side Exhaust System",
      quantity: "1 Set",
      section: "Exhaust System",
      category: "Engine & Exhaust",
    },
    {
      part: '31-Spline Driveshaft (8.38")',
      quantity: 1,
      section: "Drivetrain",
      category: "Engine & Exhaust",
    },
    {
      part: "Hydraulic Clutch Master Cylinder Kit",
      quantity: 1,
      section: "Pedal Box",
      category: "Engine & Exhaust",
    },

    // Electrical Components
    {
      part: "Custom Chassis Wiring Harness",
      quantity: 1,
      section: "Electrical System",
      category: "Electrical Components",
    },
    {
      part: "Ignition Switch",
      quantity: 1,
      section: "Dash/Gauges",
      category: "Electrical Components",
    },
    {
      part: "Headlight Switch",
      quantity: 1,
      section: "Dash/Gauges",
      category: "Electrical Components",
    },
    {
      part: "Hi-Low Beam Switch",
      quantity: 1,
      section: "Dash/Gauges",
      category: "Electrical Components",
    },
    {
      part: "Starter Solenoid",
      quantity: 1,
      section: "Electrical System",
      category: "Electrical Components",
    },
    {
      part: "Horn Button",
      quantity: 1,
      section: "Dash/Gauges",
      category: "Electrical Components",
    },
    {
      part: "Dash Indicator Lights",
      quantity: "Set",
      section: "Dash/Gauges",
      category: "Electrical Components",
    },
    {
      part: "Battery Cables/Ground Strap",
      quantity: "Set",
      section: "Electrical System",
      category: "Electrical Components",
    },
    {
      part: "Speedometer Sending Unit",
      quantity: 1,
      section: "Electrical System",
      category: "Electrical Components",
    },
    {
      part: "Vintage GPS 7-Gauge Set",
      quantity: 1,
      section: "Dash/Gauges",
      category: "Electrical Components",
    },
    {
      part: "4-Way Battery Cut-Off Switch",
      quantity: 1,
      section: "Electrical System",
      category: "Electrical Components",
    },

    // Interior Components
    {
      part: "Black Leather Seats",
      quantity: 2,
      section: "Interior",
      category: "Interior Components",
    },
    {
      part: '5-Point Harnesses (2")',
      quantity: 2,
      section: "Interior",
      category: "Interior Components",
    },
    {
      part: "Carpet Set",
      quantity: 1,
      section: "Interior",
      category: "Interior Components",
    },
    {
      part: "Emergency Brake Boot",
      quantity: 1,
      section: "Interior",
      category: "Interior Components",
    },
    {
      part: "Interior Rearview Mirror",
      quantity: 1,
      section: "Interior",
      category: "Interior Components",
    },
    {
      part: "Door Latches",
      quantity: 2,
      section: "Doors",
      category: "Interior Components",
    },
    {
      part: "Aluminum Dash with Vinyl",
      quantity: 1,
      section: "Dash/Gauges",
      category: "Interior Components",
    },
    {
      part: "Shifter Boot",
      quantity: 1,
      section: "Interior",
      category: "Interior Components",
    },
    {
      part: "Seat Tracks",
      quantity: 2,
      section: "Interior",
      category: "Interior Components",
    },
    {
      part: "A/C System Components",
      quantity: "1 Set",
      section: "A/C System",
      category: "Interior Components",
    },
    {
      part: "Sun Visor Set",
      quantity: 1,
      section: "Interior",
      category: "Interior Components",
    },

    // Exterior Components
    {
      part: "DOT Approved Windshield",
      quantity: 1,
      section: "Windshield",
      category: "Exterior Components",
    },
    {
      part: "Wind Wing Set",
      quantity: 1,
      section: "Windshield",
      category: "Exterior Components",
    },
    {
      part: "DOT Approved Headlights",
      quantity: 2,
      section: "Exterior Lights",
      category: "Exterior Components",
    },
    {
      part: "Turn Signals",
      quantity: 2,
      section: "Exterior Lights",
      category: "Exterior Components",
    },
    {
      part: "Taillights",
      quantity: 2,
      section: "Exterior Lights",
      category: "Exterior Components",
    },
    {
      part: "License Plate Light and Bracket",
      quantity: 1,
      section: "Exterior Lights",
      category: "Exterior Components",
    },
    {
      part: "GT400 Polished Side Mirrors",
      quantity: 2,
      section: "Exterior",
      category: "Exterior Components",
    },
    {
      part: "Hood Hinges with Supports",
      quantity: "1 Set",
      section: "Hood",
      category: "Exterior Components",
    },
    {
      part: "Plastic Hood Scoop",
      quantity: 1,
      section: "Hood",
      category: "Exterior Components",
    },
    {
      part: "Hidden Trunk Hinge Kit",
      quantity: 1,
      section: "Trunk",
      category: "Exterior Components",
    },
    {
      part: "Trunk Gas Strut Kit",
      quantity: 1,
      section: "Trunk",
      category: "Exterior Components",
    },
    {
      part: "Chrome Rollbar",
      quantity: 1,
      section: "Safety",
      category: "Exterior Components",
    },
    {
      part: '1.50" Rollbar Grommet Set',
      quantity: 1,
      section: "Safety",
      category: "Exterior Components",
    },
    {
      part: "Side Louvers",
      quantity: 2,
      section: "Body",
      category: "Exterior Components",
    },
    {
      part: "Brake Duct Wire Mesh Set",
      quantity: 1,
      section: "Body",
      category: "Exterior Components",
    },
    {
      part: "Factory Five Nose and Tail Badges",
      quantity: 2,
      section: "Exterior",
      category: "Exterior Components",
    },

    // Wheels and Tires
    {
      part: '18" Halibrand Style Wheels',
      quantity: 4,
      section: "Wheels/Tires",
      category: "Wheels and Tires",
    },
    {
      part: "Tires",
      quantity: 4,
      section: "Wheels/Tires",
      category: "Wheels and Tires",
    },
    {
      part: "Lug Nuts",
      quantity: "16-20",
      section: "Wheels/Tires",
      category: "Wheels and Tires",
    },

    // Fasteners and Hardware
    {
      part: "Zinc Plated Fasteners",
      quantity: "~1600",
      section: "Various",
      category: "Fasteners and Hardware",
    },
    {
      part: "Chrome and Stainless Steel Fasteners",
      quantity: "Multiple",
      section: "Various",
      category: "Fasteners and Hardware",
    },
    {
      part: "Quick-Jack Components",
      quantity: "Set",
      section: "Body Mounting",
      category: "Fasteners and Hardware",
    },
    {
      part: "Weatherstripping",
      quantity: "Multiple",
      section: "Body Mounting",
      category: "Fasteners and Hardware",
    },

    // Documentation
    {
      part: "Assembly Manual",
      quantity: 1,
      section: "Documentation",
      category: "Documentation",
    },
    {
      part: "Wiring Diagrams",
      quantity: "Set",
      section: "Documentation",
      category: "Documentation",
    },
  ];

  // Get unique categories
  const categories = [...new Set(partsData.map((item) => item.category))];

  // Filter parts based on search term
  const filteredParts = partsData.filter(
    (part) =>
      part.part.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group parts by category
  const groupedParts = categories
    .map((category) => ({
      category,
      parts: filteredParts.filter((part) => part.category === category),
    }))
    .filter((group) => group.parts.length > 0);

  // Count parts by category for badges
  const categoryCount = categories.reduce(
    (acc, category) => {
      acc[category] = partsData.filter(
        (part) => part.category === category
      ).length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-8xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Parts Inventory</h1>
            <p className="text-gray-500">I think we&apos;re missing a piece</p>
          </div>
        </div>
        <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search parts, sections or categories..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        <Accordion type="multiple" defaultValue={categories}>
          {groupedParts.map((group) => (
            <AccordionItem key={group.category} value={group.category}>
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  {group.category}
                  <Badge variant="secondary">
                    {group.parts.length}/{categoryCount[group.category]}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <div className="min-w-full border  rounded-md">
                    <div className="grid grid-cols-12  p-3 font-medium text-primary-400">
                      <div className="col-span-6">Part</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-4">Assembly Section</div>
                    </div>
                    <div className="divide-y">
                      {group.parts.map((part, idx) => (
                        <div
                          key={`${part.part}-${idx}`}
                          className="grid grid-cols-12 p-3 hover:bg-accent/50"
                        >
                          <div className="col-span-6 font-medium">
                            {part.part}
                          </div>
                          <div className="col-span-2">{part.quantity}</div>
                          <div className="col-span-4">
                            <Badge variant="outline" className="mr-1">
                              {part.section}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default PartsInventoryPage;
