"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPhotos, PhotoData } from "@/services/photo.service";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";

const PhotosPage = () => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  // Add these state variables for the lightbox
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
  //   const [page, setPage] = useState(1);
  //   const [hasMore, setHasMore] = useState(true);

  //   // Mock photo data generator (replace with actual API call)
  //   const fetchPhotos = (pageNum: number) => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         // Generate mock photos (in a real app, you'd fetch from an API)
  //         const newPhotos = Array.from({ length: 20 }, (_, i) => ({
  //           id: (pageNum - 1) * 20 + i + 1,
  //           url: `/api/placeholder/${400 + (i % 4) * 50}/${300 + (i % 3) * 50}`,
  //           title: `Photo ${(pageNum - 1) * 20 + i + 1}`,
  //         }));

  //         // Simulate end of available photos after 5 pages
  //         const noMorePhotos = pageNum >= 5;

  //         resolve({
  //           photos: newPhotos,
  //           hasMore: !noMorePhotos
  //         });
  //       }, 800);
  //     });
  //   };

  // Initial load
  useEffect(() => {
    getPhotos().then((data) => {
      setPhotos(data);
      //   setHasMore();
      setLoading(false);
    });
  }, []);

  // Infinite scroll handler
  //   const handleScroll = (e) => {
  // const { scrollTop, scrollHeight, clientHeight } = e.target;

  // Load more when user scrolls near bottom (within 300px of bottom)
  // if (scrollHeight - scrollTop - clientHeight < 300 && !loading && hasMore) {
  //   setLoading(true);
  //   const nextPage = page + 1;

  //   fetchPhotos(nextPage).then(data => {
  //     setPhotos(prev => [...prev, ...data.photos]);
  //     setPage(nextPage);
  //     setHasMore(data.hasMore);
  //     setLoading(false);
  //   });
  //     }
  //   };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <ImageLightbox
        isOpen={lightboxOpen}
        imgSrc={lightboxImage}
        altText={lightboxAlt}
        onClose={closeLightbox}
      />
      <h1 className="text-3xl font-bold mb-6">Photo Gallery</h1>

      <ScrollArea
        className="h-screen max-h-[800px] rounded-md border"
        // onScroll={handleScroll}
      >
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div
                    className="relative w-full h-48"
                    onClick={() => openLightbox(photo.url, photo.title)}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {loading &&
              // Skeleton loaders for next batch of photos
              [...Array(4)].map((_, i) => (
                <Card key={`skeleton-${i}`} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-48" />
                    <div className="p-2">
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* {!hasMore && photos.length > 0 && (
            <p className="text-center text-gray-500 mt-6">
              No more photos to load
            </p>
          )} */}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PhotosPage;
