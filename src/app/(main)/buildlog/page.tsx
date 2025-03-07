// pages/build-progress.tsx
"use client";

import React, { useEffect, useState } from "react";
import BuildTimeline from "./BuildTimeline";
import { Milestone as MilestoneIcon } from "lucide-react";
import {
  createMilestone,
  getAllMilestones,
  updateMilestone,
} from "../../../services/milestone.service";
import { Milestone, Prisma } from "@prisma/client";
import AddMilestoneModal from "./AddMilestoneModal";

const BuildProgress = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalDetails, setModalDetails] = useState<Milestone | null>(null);

  const handleAddMilestone = async (data: Prisma.MilestoneCreateInput) => {
    const newMilestone = await createMilestone(data);
    setMilestones([...milestones, newMilestone]);
  };

  const handleEditMilestone = async (
    id: number,
    data: Prisma.MilestoneUpdateInput
  ) => {
    const updatedMilestone = await updateMilestone(id, data);
    setMilestones(
      milestones.map((milestone) =>
        milestone.id === updatedMilestone.id ? updatedMilestone : milestone
      )
    );
    setModalDetails(null);
  };

  const modalToggled = () => {
    setModalDetails(null);
    setOpenModal(false);
  };

  const handleEditClicked = (milestone: Milestone) => {
    setModalDetails(milestone);
    setOpenModal(true);
  };

  useEffect(() => {
    const fetchMilestones = async () => {
      const data = await getAllMilestones();
      setMilestones(data);
    };
    fetchMilestones();
  }, []);

  return (
    <div className="container mx-auto py-8">
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
        onEditMilestone={handleEditClicked}
      />
      {/* Add Milestone Button */}
      <div className="flex justify-center mt-8 mb-4">
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center justify-center px-4 py-3 rounded-full bg-primary text-white shadow-lg hover:bg-blue-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <MilestoneIcon className="h-5 w-5 mr-2" />
          <span className="font-medium">Add Milestone</span>
        </button>
      </div>
      <AddMilestoneModal
        open={openModal}
        milestone={modalDetails}
        onOpenChange={modalToggled}
        onSubmitAdd={handleAddMilestone}
        onSubmitEdit={handleEditMilestone}
      ></AddMilestoneModal>
    </div>
  );
};

export default BuildProgress;
