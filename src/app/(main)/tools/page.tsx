"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExternalLink, Trash2 } from "lucide-react";
import { ToolModal } from "@/app/(main)/tools/ToolModal";
import { Prisma, Tool } from "@prisma/client";
import {
  checkTool,
  createTool,
  deleteTool,
  getAllTools,
} from "@/app/(main)/tools/tool.service";

const ToolsChecklistPage = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const handleAddTool = async (tool: Prisma.ToolCreateInput) => {
    const newTool = await createTool(tool);
    if (newTool.name.trim()) {
      setTools([newTool, ...tools]);
    }
  };

  const handleToggleCheck = async (id: number, status: boolean) => {
    await checkTool(id, !status);
    setTools(
      tools.map((tool) =>
        tool.id === id ? { ...tool, checked: !status } : tool
      )
    );
  };

  const handleDelete = async (id: number) => {
    await deleteTool(id);
    setTools(tools.filter((tool) => tool.id !== id));
  };

  useEffect(() => {
    // Function to fetch categories
    const fetchTools = async () => {
      const data = await getAllTools();
      setTools(data);
    };
    fetchTools();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Tools Checklist</h1>
            <p className="text-gray-500">
              Shoot, we have to go to Lowes again.
            </p>
          </div>
          <ToolModal
            submitTool={handleAddTool}
          ></ToolModal>
        </div>
        <div className="space-y-2">
          {tools.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No tools added yet. Click &#34;Add Tool&#34; to get started.
            </div>
          ) : (
            tools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center justify-between p-2 border rounded hover:bg-accent "
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`tool-${tool.id}`}
                    checked={tool.checked}
                    onCheckedChange={() =>
                      handleToggleCheck(tool.id, tool.checked)
                    }
                  />
                  <Label
                    htmlFor={`tool-${tool.id}`}
                    className={`font-medium cursor-pointer ${tool.checked ? "line-through text-gray-400" : ""}`}
                  >
                    {tool.name}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(tool.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolsChecklistPage;
