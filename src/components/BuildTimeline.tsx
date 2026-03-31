"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ImageLightbox from "@/components/ImageLightbox";
import { Milestone } from "@prisma/client";
import { dateFormat } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface BuildTimelineProps {
  milestones: Milestone[];
  onEditMilestone?: (milestone: Milestone) => void;
}

const BuildTimeline: React.FC<BuildTimelineProps> = ({ milestones, onEditMilestone }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(
    null
  );

  // Add these state variables for the lightbox
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string>("");
  const [lightboxAlt, setLightboxAlt] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(-1);
  const [currentMilestoneImages, setCurrentMilestoneImages] = useState<string[]>([]);

  // Function to collect all images from a milestone (featured + additional)
  const getAllMilestoneImages = (milestone: Milestone): string[] => {
    const images: string[] = [];
    if (milestone.featuredImage) {
      images.push(milestone.featuredImage);
    }
    if (milestone.additionalImages && milestone.additionalImages.length > 0) {
      images.push(...milestone.additionalImages);
    }
    return images;
  };

  // Function to open the lightbox
  const openLightbox = (imageSrc: string | null, alt: string, milestoneId?: number) => {
    if (!imageSrc) return;
    
    // If a milestone ID is provided, collect all images from that milestone
    if (milestoneId) {
      const milestone = milestones.find(m => m.id === milestoneId);
      if (milestone) {
        const allImages = getAllMilestoneImages(milestone);
        setCurrentMilestoneImages(allImages);
        const index = allImages.findIndex(img => img === imageSrc);
        setCurrentImageIndex(index !== -1 ? index : 0);
      }
    } else {
      // If no milestone ID, just set the single image
      setCurrentMilestoneImages([imageSrc]);
      setCurrentImageIndex(0);
    }
    
    setLightboxImage(imageSrc);
    setLightboxAlt(alt);
    setLightboxOpen(true);
  };
  
  // Function to navigate to the next photo
  const goToNextPhoto = () => {
    if (currentImageIndex < currentMilestoneImages.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      setLightboxImage(currentMilestoneImages[nextIndex]);
      setLightboxAlt(`Image ${nextIndex + 1}`);
    }
  };
  
  // Function to navigate to the previous photo
  const goToPreviousPhoto = () => {
    if (currentImageIndex > 0) {
      const prevIndex = currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      setLightboxImage(currentMilestoneImages[prevIndex]);
      setLightboxAlt(`Image ${prevIndex + 1}`);
    }
  };

  // Function to close the lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div className="my-12 w-full max-w-6xl px-1 sm:px-4">
      {/* Lightbox Component */}
      <ImageLightbox
        isOpen={lightboxOpen}
        imgSrc={lightboxImage}
        altText={lightboxAlt}
        onClose={closeLightbox}
        onNext={goToNextPhoto}
        onPrevious={goToPreviousPhoto}
        hasNext={currentImageIndex < currentMilestoneImages.length - 1}
        hasPrevious={currentImageIndex > 0}
      />

      {/* Timeline Track */}
      <div className="relative">
        {/* Original center line - hide on mobile, show on tablet and up */}
        <div className="absolute left-1/2 hidden h-full w-px -translate-x-1/2 transform bg-[rgba(192,192,194,0.18)] sm:block"></div>

        {/* Mobile only timeline line */}
        <div className="absolute left-4 h-full w-px bg-[rgba(192,192,194,0.18)] sm:hidden"></div>

        {/* Milestone Nodes */}
        <div className="relative">
          {milestones.map((milestone, index) => (
            (() => {
              const milestoneDate = new Date(milestone.date);
              const isRedlineMoment =
                milestoneDate.getMonth() === 2 && milestoneDate.getDate() === 20;
              return (
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
                    className={`z-10 mr-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm sm:mr-0 sm:mb-2 sm:h-10 sm:w-10
                    ${
                      isRedlineMoment
                        ? "bg-[rgba(227,24,55,0.9)] text-white"
                        : selectedMilestone === milestone.id
                          ? "metallic-accent text-[hsl(var(--primary-foreground))]"
                          : "bg-[rgba(49,57,77,0.9)] text-[hsl(var(--secondary))]"
                    }`}
                  >
                    <span className="text-sm font-bold sm:text-base">
                      {index + 1}
                    </span>
                  </motion.div>
                  <div className="eyebrow-label text-[0.58rem] text-[hsl(var(--muted-foreground))]">
                    {dateFormat(milestone.date)}
                  </div>
                </div>
              </div>

              {/* Timeline Content - Adjusted for mobile */}
              <motion.div
                className={`ml-12 mt-3 rounded-sm p-4 sm:ml-0 sm:mt-0 sm:w-1/2 ${
                  isRedlineMoment
                    ? "bg-[linear-gradient(135deg,rgba(227,24,55,0.14),rgba(19,27,46,0.92))]"
                    : "bg-[rgba(19,27,46,0.92)]"
                }`}
                initial={{ opacity: 0.9 }}
                whileHover={{ opacity: 1, scale: 1.02 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    {isRedlineMoment && (
                      <p className="eyebrow-label mb-1 text-[0.5rem] text-[#E31837]">Redline Moment</p>
                    )}
                    <h3 className="font-[var(--font-display)] text-xl uppercase text-foreground">
                      {milestone.title}
                    </h3>
                  </div>
                  {onEditMilestone && <Button
                    onClick={() => onEditMilestone(milestone)}
                    variant="ghost"
                    className="h-8 w-8 p-0 text-[hsl(var(--muted-foreground))] hover:text-foreground"
                  >
                    <Edit2></Edit2>
                  </Button>}
                </div>

                {/* Main Image - Now clickable to open lightbox */}
                <div
                  className="relative mb-3 h-40 w-full cursor-pointer overflow-hidden rounded-sm sm:h-48"
                  onClick={() =>
                    openLightbox(milestone.featuredImage, milestone.title, milestone.id)
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
                <p className="my-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{milestone.description}</p>

                {/* Expanded Image Gallery - Only shown when selected */}
                {selectedMilestone === milestone.id &&
                  milestone.additionalImages && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4"
                    >
                      <h4 className="eyebrow-label mb-2 text-[0.58rem] text-secondary">More Photos</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {milestone.additionalImages.map((img, i) => (
                          <div
                            key={i}
                            className="relative h-20 cursor-pointer overflow-hidden rounded-sm sm:h-24"
                            onClick={() =>
                              openLightbox(
                                img,
                                `${milestone.title} - image ${i + 1}`,
                                milestone.id
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
                        className="text-sm font-medium uppercase tracking-[0.22em] text-[hsl(var(--secondary))]"
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
              );
            })()
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildTimeline;
