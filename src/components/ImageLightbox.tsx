"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageLightboxProps {
  isOpen: boolean;
  imgSrc: string;
  altText: string;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  imgSrc,
  altText,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={imgSrc}
                alt={altText}
                width={1200}
                height={800}
                className="object-contain"
                unoptimized={true}
              />
            </div>
            {/* Close button */}
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center hover:bg-opacity-70 transition-all"
              onClick={onClose}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
            
            {/* Navigation buttons */}
            {hasPrevious && onPrevious && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center hover:bg-opacity-70 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevious();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
            )}
            
            {hasNext && onNext && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center hover:bg-opacity-70 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;
