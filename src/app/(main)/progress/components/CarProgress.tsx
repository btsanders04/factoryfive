import Image from 'next/image';
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SectionProgress {
  name: string;
  completed: number;
  total: number;
  position: {
    top: string;
    left: string;
  };
}

// These positions will need to be adjusted based on the actual image and sections
const SECTION_POSITIONS: SectionProgress[] = [
  {
    name: "Front Suspension",
    completed: 0,
    total: 0,
    position: { top: "40%", left: "15%" }
  },
  {
    name: "Engine",
    completed: 0,
    total: 0,
    position: { top: "35%", left: "25%" }
  },
  {
    name: "Interior",
    completed: 0,
    total: 0,
    position: { top: "40%", left: "50%" }
  },
  {
    name: "Rear Suspension",
    completed: 0,
    total: 0,
    position: { top: "40%", left: "85%" }
  },
  {
    name: "Body",
    completed: 0,
    total: 0,
    position: { top: "30%", left: "50%" }
  },
  {
    name: "Electrical",
    completed: 0,
    total: 0,
    position: { top: "45%", left: "35%" }
  },
  {
    name: "Brakes",
    completed: 0,
    total: 0,
    position: { top: "60%", left: "50%" }
  },
  {
    name: "Drivetrain",
    completed: 0,
    total: 0,
    position: { top: "50%", left: "70%" }
  }
];

interface CarProgressProps {
  sections: {
    [key: string]: {
      completed: number;
      total: number;
    };
  };
}

export function CarProgress({ sections }: CarProgressProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Update section data with actual progress
  const sectionData = SECTION_POSITIONS.map(section => ({
    ...section,
    completed: sections[section.name]?.completed || 0,
    total: sections[section.name]?.total || 0
  }));

  // Find sections that don't have predefined positions
  const unmappedSections = Object.keys(sections).filter(
    sectionName => !SECTION_POSITIONS.some(pos => pos.name === sectionName)
  );

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[2/1]">
      <div className="relative w-full h-full">
        <Image
          src="/images/car-silhouette.png"
          alt="Car Silhouette"
          fill
          className="object-contain"
          priority
        />
        
        {/* Section Indicators */}
        {sectionData.map((section) => {
          const percentage = section.total > 0 
            ? Math.round((section.completed / section.total) * 100) 
            : 0;

          // Skip sections with no data
          if (section.total === 0) return null;

          return (
            <TooltipProvider key={section.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full 
                      ${selectedSection === section.name 
                        ? 'ring-2 ring-primary ring-offset-2' 
                        : ''
                      }
                      ${percentage === 100 
                        ? 'bg-green-500' 
                        : percentage > 0 
                          ? 'bg-yellow-500' 
                          : 'bg-gray-300'
                      }
                      hover:scale-110 transition-transform cursor-pointer`}
                    style={{
                      top: section.position.top,
                      left: section.position.left,
                    }}
                    onClick={() => setSelectedSection(
                      selectedSection === section.name ? null : section.name
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{section.name}</p>
                  <p className="text-sm">{percentage}% Complete</p>
                  <p className="text-xs text-gray-500">
                    {section.completed} of {section.total} tasks completed
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Section Details Card */}
      {selectedSection && (
        <Card className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-4 w-64 bg-white shadow-lg">
          <h3 className="font-semibold mb-2">{selectedSection}</h3>
          {(() => {
            // Check if it's a mapped section
            const mappedSection = sectionData.find(s => s.name === selectedSection);
            
            if (mappedSection && mappedSection.total > 0) {
              const percentage = Math.round((mappedSection.completed / mappedSection.total) * 100);
              
              return (
                <>
                  <Progress value={percentage} className="mb-2" />
                  <p className="text-sm text-gray-600">
                    {mappedSection.completed} of {mappedSection.total} tasks completed
                  </p>
                </>
              );
            }
            
            // Check if it's an unmapped section
            if (unmappedSections.includes(selectedSection) && sections[selectedSection]) {
              const section = sections[selectedSection];
              const percentage = section.total > 0 
                ? Math.round((section.completed / section.total) * 100) 
                : 0;
              
              return (
                <>
                  <Progress value={percentage} className="mb-2" />
                  <p className="text-sm text-gray-600">
                    {section.completed} of {section.total} tasks completed
                  </p>
                </>
              );
            }
            
            return <p className="text-sm text-gray-600">No data available</p>;
          })()}
        </Card>
      )}
    </div>
  );
} 