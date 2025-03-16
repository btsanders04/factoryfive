"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@prisma/client";
import { getAllTools } from "@/data/tool";
import { getAllPartsInventory } from "@/data/partsinventory";

interface ToolWithSection {
  tool: Tool;
  section: string;
  estimatedUse: string | null;
  status: "needed" | "acquired" | "used";
}

export function ToolsTimeline() {
  const [toolsBySection, setToolsBySection] = useState<Map<string, ToolWithSection[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tools, parts] = await Promise.all([
          getAllTools(),
          getAllPartsInventory()
        ]);

        // Create a map of tools with their sections
        const toolSections = new Map<string, ToolWithSection[]>();
        
        // Get all unique sections from parts
        const sections = [...new Set(parts.map(part => part.section))];
        
        // For each section, find tools that might be needed
        sections.forEach(section => {
          const sectionTools: ToolWithSection[] = [];
          
          // For simplicity, assign all tools to each section
          // In a real app, you would have a more sophisticated relationship
          tools.forEach(tool => {
            sectionTools.push({
              tool,
              section,
              estimatedUse: null, // In a real app, this would be calculated
              status: tool.aquired ? "acquired" : "needed"
            });
          });
          
          if (sectionTools.length > 0) {
            toolSections.set(section, sectionTools);
          }
        });

        setToolsBySection(toolSections);
      } catch (error) {
        console.error("Error fetching tools timeline data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "needed":
        return "bg-red-500";
      case "acquired":
        return "bg-yellow-500";
      case "used":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return <div>Loading timeline...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tools Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-8">
            {Array.from(toolsBySection.entries()).map(([section, tools]) => (
              <div key={section} className="relative">
                <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-2">
                  <h3 className="text-lg font-semibold">{section}</h3>
                </div>
                <div className="space-y-2">
                  {tools.map((toolData, index) => (
                    <div
                      key={`${toolData.tool.id}-${index}`}
                      className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(toolData.status)}`} />
                        <span className="font-medium">{toolData.tool.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {toolData.status}
                        </Badge>
                        {toolData.estimatedUse && (
                          <span className="text-sm text-muted-foreground">
                            Est: {toolData.estimatedUse}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 