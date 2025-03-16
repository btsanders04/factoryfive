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

  return (
    <Card className="w-full max-w-md">
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
          neededTools.map((tool) => (
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
      </CardContent>

      <CardFooter className="justify-between text-sm text-gray-500">
        <div>{totalAquiredTools + totalNeededTools} total tools</div>
        <div>{totalAquiredTools} acquired</div>
      </CardFooter>
    </Card>
  );
};

export default ToolsNeededCard;
