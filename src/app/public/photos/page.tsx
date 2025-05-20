"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPhotos, PhotoData, PaginationData } from "@/data/photo";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";


const PhotosPage = () => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string>("");
  const [lightboxAlt, setLightboxAlt] = useState<string>("");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(-1);

  // Function to open the lightbox
  const openLightbox = (imageSrc: string, alt: string) => {
    const index = photos.findIndex(photo => photo.url === imageSrc);
    setCurrentPhotoIndex(index);
    setLightboxImage(imageSrc);
    setLightboxAlt(alt);
    setLightboxOpen(true);
  };
  
  // Function to navigate to the next photo
  const goToNextPhoto = async () => {
    // Check if we're approaching the end of the loaded photos
    const isNearEnd = currentPhotoIndex >= photos.length - 3;
    
    // If we're near the end and there are more photos to load, load them
    if (isNearEnd && pagination?.hasMore && !loadingMore) {
      await loadMorePhotos();
    }
    
    // Navigate to the next photo if available
    if (currentPhotoIndex < photos.length - 1) {
      const nextIndex = currentPhotoIndex + 1;
      const nextPhoto = photos[nextIndex];
      setCurrentPhotoIndex(nextIndex);
      setLightboxImage(nextPhoto.url);
      setLightboxAlt(nextPhoto.title);
    }
  };
  
  // Function to navigate to the previous photo
  const goToPreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      const prevIndex = currentPhotoIndex - 1;
      const prevPhoto = photos[prevIndex];
      setCurrentPhotoIndex(prevIndex);
      setLightboxImage(prevPhoto.url);
      setLightboxAlt(prevPhoto.title);
    }
  };

  // Function to close the lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
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
  }, []);
  
  // Set up scroll event listener for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = document.getElementById('public-photos-scroll-area');
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
    
    const scrollArea = document.getElementById('public-photos-scroll-area');
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
        onNext={goToNextPhoto}
        onPrevious={goToPreviousPhoto}
        hasNext={currentPhotoIndex < photos.length - 1}
        hasPrevious={currentPhotoIndex > 0}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Photo Gallery</h1>
      </div>

      <ScrollArea className="h-screen max-h-[800px] rounded-md border" id="public-photos-scroll-area">
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
                      />
                    </div>
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
