"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPhotos, PhotoData } from "@/data/photo";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";


const PhotosPage = () => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string>("");
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

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
  // Initial load
  useEffect(() => {
    getPhotos().then((data) => {
      setPhotos(data);
      setLoading(false);
    });

  }, []);

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
      </div>

      <ScrollArea className="h-screen max-h-[800px] rounded-md border">
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
                  </div>
                </CardContent>
              </Card>
            ))}

            {loading &&
              // Skeleton loaders for next batch of photos
              [...Array(photos.length !== 0 ? photos.length : 4)].map(
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
