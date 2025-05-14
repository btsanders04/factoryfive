"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star } from "lucide-react";
import { getPhotos, PhotoData, PaginationData } from "@/data/photo";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllMilestones,
  setPrimaryPhotoOnMilestone,
  updateSecondaryPhotosOnMilestone,
} from "@/data/milestone";
import { Milestone } from "@prisma/client";

const PhotosPage = () => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string>("");
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  // Add these state variables for milestone feature
  const [selectedMilestone, setSelectedMilestone] = useState<
    Milestone | null | undefined
  >(null);
  const [selectValue, setSelectValue] = useState<string>("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Function to open the lightbox
  const openLightbox = (imageSrc: string, alt: string) => {
    setLightboxImage(imageSrc);
    setLightboxAlt(alt);
    setLightboxOpen(true);
  };

  // Function to close the lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const selectMilestone = (milestone?: Milestone | null ) => {
    setSelectedMilestone(milestone);
    setSelectValue(milestone?.id.toString() || "");
  };

  const setPrimaryPhoto = async (photoUrl: string) => {
    if (selectedMilestone) {
      const updatedMilestone = await setPrimaryPhotoOnMilestone(
        selectedMilestone.id,
        photoUrl
      );
      setSelectedMilestone(updatedMilestone);
      setMilestones(
        milestones.map((milestone) =>
          milestone.id === updatedMilestone.id ? updatedMilestone : milestone
        )
      );
    }
  };

  // Function to toggle milestone for a photo
  const togglePhotoMilestone = async (photoUrl: string) => {
    if (selectedMilestone) {
      let updatedImages = [];
      if (
        selectedMilestone.additionalImages.find((image) => image === photoUrl)
      ) {
        updatedImages = selectedMilestone.additionalImages.filter(
          (image) => image !== photoUrl
        );
      } else {
        updatedImages = [...selectedMilestone.additionalImages, photoUrl];
      }
      const updatedMilestone = await updateSecondaryPhotosOnMilestone(
        selectedMilestone.id,
        updatedImages
      );
      setSelectedMilestone(updatedMilestone);
      setMilestones(
        milestones.map((milestone) =>
          milestone.id === updatedMilestone.id ? updatedMilestone : milestone
        )
      );
    }
  };

  // Function to load more photos
  const loadMorePhotos = async () => {
    if (!pagination || !pagination.hasMore || loadingMore) return;
    
    console.log('Loading more photos...');
    setLoadingMore(true);
    try {
      const nextOffset = pagination.offset + pagination.limit;
      const data = await getPhotos(nextOffset, pagination.limit);
      
      setPhotos(prevPhotos => [...prevPhotos, ...data.photos]);
      setPagination(data.pagination);
      console.log('Loaded more photos:', data.photos.length);
    } catch (error) {
      console.error('Error loading more photos:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getPhotos(0, 20);
        setPhotos(data.photos);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    getAllMilestones().then((data) => {
      setMilestones(data);
    });
  }, []);
  
  // Set up scroll event listener for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = document.getElementById('photos-scroll-area');
      if (!scrollArea) return;
      
      const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
      if (!viewport) return;
      
      const { scrollTop, scrollHeight, clientHeight } = viewport as HTMLElement;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 300;
      
      if (isNearBottom && pagination?.hasMore && !loadingMore) {
        console.log('Near bottom, loading more photos...');
        loadMorePhotos();
      }
    };
    
    const scrollArea = document.getElementById('photos-scroll-area');
    if (scrollArea) {
      const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.addEventListener('scroll', handleScroll);
        return () => viewport.removeEventListener('scroll', handleScroll);
      }
    }
  }, [pagination, loadingMore]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <ImageLightbox
        isOpen={lightboxOpen}
        imgSrc={lightboxImage}
        altText={lightboxAlt}
        onClose={closeLightbox}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Photo Gallery</h1>
        <div className="flex items-center gap-2">
          {/* Milestone selector dropdown with explicit "None" option */}
          <div className="space-y-2">
            <Select
              value={selectValue}
              onValueChange={(value) =>
                selectMilestone(
                  milestones.find(
                    (milestone) => milestone.id === parseInt(value)
                  )
                )
              }
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-primary-400">
                <SelectValue placeholder="Add photos to milestone" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {milestones.map((milestone, index) => (
                  <SelectItem
                    key={milestone.id}
                    value={milestone.id.toString()}
                  >
                    Milestone #{index + 1}: {milestone.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedMilestone && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectMilestone(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-screen max-h-[800px] rounded-md border" id="photos-scroll-area">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="relative w-full h-48">
                    {/* Image */}
                    <div
                      onClick={() => openLightbox(photo.url, photo.title)}
                      className="absolute inset-0"
                    >
                      <Image
                        src={photo.url}
                        alt={photo.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        unoptimized={true}
                      />
                    </div>

                    {/* Button controls container */}
                    {selectedMilestone && (
                      <div className="absolute top-2 right-2 flex space-x-2">
                        {/* Primary photo button - always shown */}
                        <Button
                          className={`p-1 rounded-full ${
                            selectedMilestone.featuredImage === photo.url
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-500"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrimaryPhoto(photo.url);
                          }}
                          title="Set as primary photo"
                        >
                          <Star size={20} />
                        </Button>

                        {/* Checkmark button - only shown when milestone is selected */}

                        <Button
                          className={`p-1 rounded-full ${
                            selectedMilestone.additionalImages.includes(
                              photo.url
                            )
                              ? "bg-green-500 text-white"
                              : "bg-white text-gray-500"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePhotoMilestone(photo.url);
                          }}
                          title="Add to milestone"
                        >
                          <CheckCircle size={20} />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {(loading || loadingMore) &&
              // Skeleton loaders for next batch of photos
              [...Array(loading ? 8 : 4)].map(
                (_, i) => (
                  <Card key={`skeleton-${i}`} className="overflow-hidden">
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-48" />
                      <div className="p-2">
                        <Skeleton className="h-4 w-20 mx-auto" />
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PhotosPage;
