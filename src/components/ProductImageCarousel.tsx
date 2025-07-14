"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ProductImageCarouselProps {
  images: string[];
  title: string;
  type?: string;
}

export default function ProductImageCarousel({
  images,
  title,
  type,
}: ProductImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Prevent text selection during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "";
    }

    return () => {
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  // Filter out empty or undefined images
  const validImages = images.filter((img) => img && img.trim() !== "");

  if (validImages.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden bg-minimal-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-minimal-gray-500 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">No images available</p>
        </div>
      </div>
    );
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const diff = startX - currentX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left - next image
        goToNext();
      } else {
        // Swiped right - previous image
        goToPrevious();
      }
    }

    setIsDragging(false);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    setIsDragging(false);
  };

  return (
    <div
      ref={carouselRef}
      className="relative aspect-square overflow-hidden bg-minimal-gray-900 rounded-lg cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Main Image */}
      <Image
        src={validImages[currentImageIndex]}
        alt={`${title} - Image ${currentImageIndex + 1}`}
        fill
        className="object-cover transition-opacity duration-300 select-none"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={currentImageIndex === 0}
        draggable={false}
      />

      {/* Premium badge matching ProductCard style */}
      {type && (
        <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-minimal-black to-minimal-gray-800 text-minimal-white text-xs font-bold rounded-full shadow-lg border border-minimal-gray-700/50 overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-minimal-white/20 to-transparent -translate-x-full animate-shimmer"></div>
          <span className="relative z-10 drop-shadow-sm">{type}</span>
        </div>
      )}

      {/* Image Counter */}
      {validImages.length > 1 && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-minimal-black/80 backdrop-blur-sm text-minimal-white text-xs font-medium rounded-full z-10">
          {currentImageIndex + 1} / {validImages.length}
        </div>
      )}

      {/* Indicators - Same style as home page */}
      {validImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex gap-3">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-minimal-white w-12"
                    : "bg-minimal-gray-600 w-4 hover:bg-minimal-gray-400"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Navigation */}
      <div
        className="absolute inset-0 focus:outline-none"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            goToPrevious();
          } else if (e.key === "ArrowRight") {
            goToNext();
          }
        }}
      />
    </div>
  );
}
