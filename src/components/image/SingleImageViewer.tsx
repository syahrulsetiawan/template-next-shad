"use client";

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import Image from "next/image";
import { cn } from "@/lib/utils"; // optional kalau lu udah punya helper class merge shadcn

interface SingleImageViewerProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  rounded?: boolean;
}

export function SingleImageViewer({
  src,
  alt = "Image",
  className,
  width = 300,
  height = 200,
  rounded = true,
}: SingleImageViewerProps) {
  return (
    <PhotoProvider>
      <PhotoView src={src}>
        <div
          className={cn(
            "cursor-zoom-in inline-block overflow-hidden transition-transform hover:scale-[1.02]",
            rounded && "rounded-xl shadow-sm",
            className
          )}
        >
          <img
            src={src}
            alt={alt}
            style={{ width: `${width}px`, height: `${height}px`, objectFit: "cover" }}
          />
        </div>
      </PhotoView>
    </PhotoProvider>
  );
}
