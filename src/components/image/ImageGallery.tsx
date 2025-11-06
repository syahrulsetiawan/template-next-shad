"use client";

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: { src: string; alt?: string }[];
  className?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  rounded?: boolean;
  gap?: number; // jarak antar thumbnail
  columns?: number; // jumlah kolom grid
}

export function ImageGallery({
  images,
  className,
  thumbnailWidth = 150,
  thumbnailHeight = 100,
  rounded = true,
  gap = 8,
  columns = 3,
}: ImageGalleryProps) {
  return (
    <PhotoProvider>
      <div
        className={cn(
          "grid",
          className
        )}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap}px`,
        }}
      >
        {images.map((image, index) => (
          <PhotoView key={index} src={image.src}>
            <div
              className={cn(
                "cursor-zoom-in overflow-hidden transition-transform hover:scale-[1.02]",
                rounded && "rounded-xl shadow-sm"
              )}
              style={{
                width: thumbnailWidth,
                height: thumbnailHeight,
              }}
            >
              <img
                src={image.src}
                alt={image.alt || `Image ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
}
