"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ImageLightbox from "@/components/ImageLightbox";
import { Milestone } from "@prisma/client";
import { dateFormat } from "@/lib/utils";


interface BuildTimelineProps {
  milestones: Milestone[];
}

const BuildTimeline: React.FC<BuildTimelineProps> = ({ milestones }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(
    null
  );

  // Add these state variables for the lightbox
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string>("");
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  // Function to open the lightbox
  const openLightbox = (imageSrc: string | null, alt: string) => {
    setLightboxImage(imageSrc || "");
    setLightboxAlt(alt);
    setLightboxOpen(true);
  };

  // Function to close the lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-12 px-4">
      {/* Lightbox Component */}
      <ImageLightbox
        isOpen={lightboxOpen}
        imgSrc={lightboxImage}
        altText={lightboxAlt}
        onClose={closeLightbox}
      />

      {/* Timeline Track */}
      <div className="relative">
        {/* Original center line - hide on mobile, show on tablet and up */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300 hidden sm:block"></div>

        {/* Mobile only timeline line */}
        <div className="absolute left-4 h-full w-1 bg-gray-300 sm:hidden"></div>

        {/* Milestone Nodes */}
        <div className="relative">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`mb-16 ${
                /* For mobile, always display in a vertical column */
                /* For larger screens, keep original alternating layout */
                index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
              } flex flex-col sm:flex-row sm:items-center`}
            >
              {/* Timeline Node - Modified for mobile */}
              <div className="sm:w-1/2 flex sm:justify-center">
                <div
                  className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row"} sm:flex-col items-center`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    onClick={() =>
                      setSelectedMilestone(
                        selectedMilestone === milestone.id ? null : milestone.id
                      )
                    }
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer flex items-center justify-center z-10 mr-3 sm:mr-0 sm:mb-2 hover:bg-primary
                    ${selectedMilestone === milestone.id ? "bg-primary" : "bg-gray-400"}`}
                  >
                    <span className="text-white font-bold text-sm sm:text-base">
                      {index + 1}
                    </span>
                  </motion.div>
                  <div className="text-sm font-medium text-gray-600">
                    {dateFormat(milestone.date)}
                  </div>
                </div>
              </div>

              {/* Timeline Content - Adjusted for mobile */}
              <motion.div
                className="ml-12 sm:ml-0 mt-3 sm:mt-0 sm:w-1/2 p-4 rounded-lg shadow-md bg-white"
                initial={{ opacity: 0.9 }}
                whileHover={{ opacity: 1, scale: 1.02 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-700">{milestone.title}</h3>
                </div>

                {/* Main Image - Now clickable to open lightbox */}
                <div
                  className="relative w-full h-40 sm:h-48 mb-3 overflow-hidden rounded cursor-pointer"
                  onClick={() =>
                    openLightbox(milestone.featuredImage, milestone.title)
                  }
                >
                  <Image
                    src={milestone.featuredImage || ""}
                    alt={milestone.title}
                    fill
                    unoptimized={true}
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Description */}
                <p className="my-3 text-gray-700">{milestone.description}</p>

                {/* Expanded Image Gallery - Only shown when selected */}
                {selectedMilestone === milestone.id &&
                  milestone.additionalImages && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4"
                    >
                      <h4 className="font-semibold mb-2">More Photos</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {milestone.additionalImages.map((img, i) => (
                          <div
                            key={i}
                            className="relative h-20 sm:h-24 rounded overflow-hidden cursor-pointer"
                            onClick={() =>
                              openLightbox(
                                img,
                                `${milestone.title} - image ${i + 1}`
                              )
                            }
                          >
                            <Image
                              src={`${img}?size=sm`}
                              alt={`${milestone.title} - image ${i + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              unoptimized={true}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                {/* Toggle Button - Only if there are additional images */}
                {milestone.additionalImages &&
                  milestone.additionalImages.length > 0 && (
                    <div className="text-center mt-4">
                      <button
                        className="text-blue-600 text-sm font-medium"
                        onClick={() =>
                          setSelectedMilestone(
                            selectedMilestone === milestone.id
                              ? null
                              : milestone.id
                          )
                        }
                      >
                        {selectedMilestone === milestone.id
                          ? "Show Less"
                          : "Show More Photos"}
                      </button>
                    </div>
                  )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildTimeline;
