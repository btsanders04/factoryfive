"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllTools } from "@/data/tool";
import { Tool } from "@prisma/client";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const ToolsNeededCard = () => {
  const [neededTools, setNeededTools] = useState<Tool[]>([]);
  const [totalAquiredTools, setTotalAquiredTools] = useState<number>(0);
  const [totalNeededTools, setTotalNeededTools] = useState<number>(0);

  useEffect(() => {
    // Function to fetch categories
    const fetchTools = async () => {
      const data = await getAllTools();
      setNeededTools(data.filter((tool) => !tool.aquired));
      setTotalAquiredTools(data.filter((tool) => tool.aquired).length);
      setTotalNeededTools(data.filter((tool) => !tool.aquired).length);
    };
    fetchTools();
  }, []);

  // Calculate completion percentage
  const totalTools = totalAquiredTools + totalNeededTools;
  const completionPercentage = totalTools > 0 
    ? Math.round((totalAquiredTools / totalTools) * 100) 
    : 100;

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Tools Needed</span>
          <Badge
          // variant={
          //   tools.filter((tool) => !tool.aquired) === 0
          //     ? "success"
          //     : "secondary"
          // }
          >
            {totalNeededTools} remaining
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {neededTools.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            All tools aquired
          </div>
        ) : (
          // Show only up to 5 tools in the dashboard card
          neededTools.slice(0, 5).map((tool) => (
            <div key={tool.id} className="flex items-center gap-2">
              <div>
                <Label
                  htmlFor={`tool-${tool.id}`}
                  className={"font-medium cursor-pointer"}
                >
                  {tool.name}
                </Label>
              </div>
              <div>
                {tool.link && (
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
        
        {/* Show message if there are more tools than displayed */}
        {neededTools.length > 5 && (
          <div className="text-sm text-gray-500 italic">
            +{neededTools.length - 5} more tools needed
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="flex justify-between w-full text-sm text-gray-500">
          <div>{totalTools} total tools</div>
          <div>{completionPercentage}% complete</div>
        </div>
        
        {/* Link to tools page */}
        <Link 
          href="/tools" 
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline block w-full"
        >
          View all tools →
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ToolsNeededCard;
