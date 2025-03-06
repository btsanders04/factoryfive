// pages/build-progress.tsx
"use client"

import React from 'react';
import { NextPage } from 'next';
import BuildTimeline from './BuildTimeline';

// Define the milestone data type
interface Milestone {
  id: number;
  title: string;
  date: string;
  description: string;
  featuredImage: string;
  additionalImages?: string[];
}

const buildMilestones: Milestone[] = [
  {
    id: 1,
    title: "Kit Delivery Day",
    date: "April 5, 2025",
    description: "After months of anticipation, our Factory Five MK5 Roadster kit arrived! The excitement was overwhelming as we started unpacking all the components.",
    featuredImage: `/api/synology/photos/${128166}`,
    additionalImages: [
      `/api/synology/photos/${128166}`,
      `/api/synology/photos/${128166}`,
      `/api/synology/photos/${128166}`,
    ]
  },
  {
    id: 2,
    title: "Chassis Preparation",
    date: "April 20, 2025",
    description: "We began prepping the powder-coated chassis by installing the aluminum panels and preparing it for the drivetrain installation. The riveting process was surprisingly satisfying!",
    featuredImage: "/images/pexels-alexant-7004697.jpg",
    additionalImages: [
      "/images/pexels-alexant-7004697.jpg",
      "/images/pexels-alexant-7004697.jpg",
      "/images/pexels-alexant-7004697.jpg",
    ]
  },
  {
    id: 3,
    title: "Engine Installation",
    date: "May 15, 2025",
    description: "The big day arrived! We carefully lowered our 351W engine and TKO transmission into the chassis as a single unit. Getting everything aligned properly was challenging but rewarding.",
    featuredImage: "/images/pexels-alexant-7004697.jpg",
    additionalImages: [
      "/images/pexels-alexant-7004697.jpg",
      "/images/pexels-alexant-7004697.jpg",
      "/images/pexels-alexant-7004697.jpg",
      "/images/milestones/engine-complete.jpg",
    ]
  },
  {
    id: 4,
    title: "IRS Suspension Setup",
    date: "June 2, 2025",
    description: "Installing the independent rear suspension was complex but transformed the chassis into something that actually resembled a car! The precision required was impressive.",
    featuredImage: "/images/milestones/irs-main.jpg",
    additionalImages: [
      "/images/milestones/irs-components.jpg",
      "/images/milestones/irs-assembly.jpg",
      "/images/milestones/irs-installed.jpg",
    ]
  },
  {
    id: 5,
    title: "Rolling Chassis Complete",
    date: "June 28, 2025", 
    description: "A major milestone achieved! With the front suspension installed and wheels mounted, we had our first rolling chassis. We couldn't resist pushing it around the garage a few times.",
    featuredImage: "/images/milestones/rolling-chassis.jpg",
    additionalImages: [
      "/images/milestones/wheels-mounted.jpg",
      "/images/milestones/first-roll.jpg",
    ]
  },
  // Add more milestones as your build progresses
];

const BuildProgress: NextPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center my-8">Our MK5 Build Journey</h1>
      <p className="text-center max-w-2xl mx-auto mb-12">
        Follow along as we document our Factory Five MK5 Roadster build from kit delivery to first drive.
        Each milestone captures a key moment in bringing this amazing car to life.
      </p>
      <BuildTimeline milestones={buildMilestones} />
    </div>
  );
};

export default BuildProgress;