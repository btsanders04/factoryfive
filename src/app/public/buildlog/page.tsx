// pages/build-progress.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  getAllMilestones,
} from "@/data/milestone";
import { Milestone } from "@prisma/client";
import BuildTimeline from "@/components/BuildTimeline";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const BuildProgress = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const fetchMilestones = async () => {
      const data = await getAllMilestones();
      setMilestones(data);
    };
    fetchMilestones();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="flex items-center gap-2">
          <Link href="/public">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <h1 className="text-4xl font-bold text-center my-8">
        Our MK5 Build Journey
      </h1>
      <p className="text-center max-w-2xl mx-auto mb-12">
        Follow along as we document our Factory Five MK5 Roadster build from kit
        delivery to first drive. Each milestone captures a key moment in
        bringing this amazing car to life.
      </p>
      <BuildTimeline
        milestones={milestones}
      />    
    </div>
  );
};

export default BuildProgress;
