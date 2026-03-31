// pages/build-progress.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { getAllMilestones } from "@/data/milestone";
import { Milestone } from "@prisma/client";
import BuildTimeline from "@/components/BuildTimeline";

const BuildProgress = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const fetchMilestones = async () => {
      const data = await getAllMilestones();
      setMilestones([...data].reverse());
    };
    fetchMilestones();
  }, []);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-2 py-4 sm:px-4">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="app-section overflow-hidden">
          <div className="relative p-6 sm:p-8">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "url('/images/background.JPEG')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,19,38,0.82),rgba(11,19,38,0.98))]" />
            <div className="relative z-10 max-w-3xl space-y-5">
              <p className="eyebrow-label text-[0.68rem] text-secondary">Chassis Assembly Walkthrough</p>
              <h1 className="text-4xl font-semibold uppercase leading-none text-foreground sm:text-6xl">
                Our Mk5
                <br />
                Build Journey
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--muted-foreground))] sm:text-base">
                Follow along as we take the Factory Five roadster from crate delivery to first engine fire. Each milestone captures another step in the build and the progress we&apos;ve made along the way.
              </p>
            </div>
          </div>
        </Card>

        <Card className="app-card p-6 sm:p-8">
          <CardContent className="space-y-5 px-0 py-0">
            <div>
              <p className="eyebrow-label text-[0.62rem] text-secondary">Timeline Status</p>
              <h2 className="mt-3 text-3xl uppercase text-foreground">Build Log</h2>
            </div>
            <div className="grid gap-3">
              <div className="glass-panel flex items-center justify-between rounded-sm px-4 py-4">
                <div>
                  <p className="eyebrow-label text-[0.56rem] text-[hsl(var(--muted-foreground))]">Milestones</p>
                  <p className="mt-2 font-[var(--font-display)] text-3xl text-[hsl(var(--secondary))]">{milestones.length}</p>
                </div>
                <Wrench className="h-7 w-7 text-[hsl(var(--secondary))]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <BuildTimeline milestones={milestones} />
    </div>
  );
};

export default BuildProgress;
