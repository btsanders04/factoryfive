"use client";

import React, { useEffect, useState } from "react";
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

  const openLightbox = (imageSrc: string, alt: string) => {
    const index = photos.findIndex((photo) => photo.url === imageSrc);
    setCurrentPhotoIndex(index);
    setLightboxImage(imageSrc);
    setLightboxAlt(alt);
    setLightboxOpen(true);
  };

  const goToNextPhoto = async () => {
    const isNearEnd = currentPhotoIndex >= photos.length - 3;

    if (isNearEnd && pagination?.hasMore && !loadingMore) {
      await loadMorePhotos();
    }

    if (currentPhotoIndex < photos.length - 1) {
      const nextIndex = currentPhotoIndex + 1;
      const nextPhoto = photos[nextIndex];
      setCurrentPhotoIndex(nextIndex);
      setLightboxImage(nextPhoto.url);
      setLightboxAlt(nextPhoto.title);
    }
  };

  const goToPreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      const prevIndex = currentPhotoIndex - 1;
      const prevPhoto = photos[prevIndex];
      setCurrentPhotoIndex(prevIndex);
      setLightboxImage(prevPhoto.url);
      setLightboxAlt(prevPhoto.title);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const loadMorePhotos = async () => {
    if (!pagination || !pagination.hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextOffset = pagination.offset + pagination.limit;
      const data = await getPhotos(nextOffset, pagination.limit);

      setPhotos((prevPhotos) => [...prevPhotos, ...data.photos]);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error loading more photos:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getPhotos(0, 20);
        setPhotos(data.photos);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = document.getElementById("public-photos-scroll-area");
      if (!scrollArea) return;

      const viewport = scrollArea.querySelector("[data-radix-scroll-area-viewport]");
      if (!viewport) return;

      const { scrollTop, scrollHeight, clientHeight } = viewport as HTMLElement;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 300;

      if (isNearBottom && pagination?.hasMore && !loadingMore) {
        loadMorePhotos();
      }
    };

    const scrollArea = document.getElementById("public-photos-scroll-area");
    if (scrollArea) {
      const viewport = scrollArea.querySelector("[data-radix-scroll-area-viewport]");
      if (viewport) {
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      }
    }
  }, [pagination, loadingMore]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-2 py-4 sm:px-4">
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

      <section>
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
              <p className="eyebrow-label text-[0.68rem] text-secondary">Build Photography Archive</p>
              <h1 className="text-4xl font-semibold uppercase leading-none text-foreground sm:text-6xl">
                Photo
                <br />
                Gallery
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[hsl(var(--muted-foreground))] sm:text-base">
                Browse the latest photos from the Factory Five build, with the newest updates shown first.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <ScrollArea
        className="glass-panel h-screen max-h-[900px] rounded-sm ghost-outline"
        id="public-photos-scroll-area"
      >
        <div className="p-4 sm:p-5">
          <div className="mb-5">
            <div>
              <p className="eyebrow-label text-[0.58rem] text-secondary">Newest Uploads First</p>
              <h2 className="mt-2 text-2xl uppercase text-foreground">Build Frames</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo, index) => (
              <Card
                key={photo.id}
                className="group overflow-hidden rounded-sm border-0 bg-[rgba(19,27,46,0.95)] transition-transform duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => openLightbox(photo.url, photo.title)}
                    className="block w-full text-left"
                    aria-label={`Open photo ${photo.title}`}
                  >
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={photo.url}
                        alt={photo.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        unoptimized={true}
                      />
                    </div>
                  </button>
                </CardContent>
              </Card>
            ))}

            {(loading || loadingMore) &&
              [...Array(loading ? 8 : 4)].map((_, i) => (
                <Card key={`skeleton-${i}`} className="overflow-hidden rounded-sm border-0 bg-[rgba(19,27,46,0.95)]">
                  <CardContent className="p-0">
                    <Skeleton className="h-56 w-full bg-[rgba(49,57,77,0.55)]" />
                    <div className="space-y-3 p-4">
                      <Skeleton className="h-3 w-24 bg-[rgba(49,57,77,0.55)]" />
                      <Skeleton className="h-5 w-2/3 bg-[rgba(49,57,77,0.55)]" />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PhotosPage;
