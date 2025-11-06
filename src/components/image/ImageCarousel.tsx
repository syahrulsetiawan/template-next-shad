"use client";

import { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: { src: string; alt?: string }[];
  width?: number;
  height?: number;
  rounded?: boolean;
  className?: string;
}

export function ImageCarousel({
  images,
  width = 400,
  height = 250,
  rounded = true,
  className,
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const next = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <PhotoProvider>
      <div className={cn("relative flex items-center", className)} style={{ width }}>
        {/* Image */}
        <AnimatePresence initial={false}>
          <PhotoView key={current} src={images[current].src}>
            <motion.div
              key={images[current].src}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "overflow-hidden cursor-zoom-in",
                rounded && "rounded-xl shadow-sm"
              )}
              style={{ width, height }}
            >
              <img
                src={images[current].src}
                alt={images[current].alt || `Image ${current + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </motion.div>
          </PhotoView>
        </AnimatePresence>

        {/* Prev / Next Buttons */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition",
                index === current ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>
      </div>
    </PhotoProvider>
  );
}
