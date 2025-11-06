'use client';

import React, { useState, useCallback, ChangeEvent, DragEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  label?: string;
  className?: string;
  accept?: string;
  initialImage?: string; // URL image existing
  maxFileSizeMB?: number; // default 2MB
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileChange,
  label = 'Upload Gambar',
  className,
  accept = 'image/*',
  initialImage,
  maxFileSizeMB = 2, // default 2MB
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // loader state

  useEffect(() => {
    if (initialImage) {
      setPreviewUrl(initialImage);
    }
  }, [initialImage]);

  const handleFileChange = (file: File | null) => {
    if (file) {
      // validasi ukuran file
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        alert(`Ukuran file maksimal ${maxFileSizeMB} MB`);
        return;
      }

      setIsUploading(true);

      // simulasi delay proses upload
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      setTimeout(() => {
        setSelectedFile(file);
        onFileChange(file);
        setIsUploading(false);
      }, 500); // bisa ganti dengan upload async sebenarnya
    } else {
      if (selectedFile) URL.revokeObjectURL(previewUrl!);
      setPreviewUrl(initialImage || null);
      setSelectedFile(null);
      onFileChange(null);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    handleFileChange(file);
  };

  const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleFileChange(null);
    const inputElement = document.getElementById('image-upload-input') as HTMLInputElement;
    if (inputElement) inputElement.value = '';
  };

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diizinkan!');
        return;
      }
      handleFileChange(file);
    }
  }, []);

  return (
    <div className={cn('grid w-full items-center gap-1.5', className)}>
      <Label htmlFor="image-upload-input" className="mb-2">{label}</Label>
      <div
        className={cn(
          'relative w-full cursor-pointer rounded-lg border-2 border-dashed transition-colors',
          'min-h-[120px] flex items-center justify-center',
          'hover:border-primary/50',
          isDragOver
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50',
          previewUrl && 'border-solid border-green-500/50 hover:border-green-500/50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!selectedFile) {
            document.getElementById('image-upload-input')?.click();
          }
        }}
      >
        <Input
          id="image-upload-input"
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          aria-hidden="true"
        />

        {previewUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className={cn("w-full h-full object-cover rounded-lg", isUploading && "opacity-50")}
            />

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                <div className="loader border-t-2 border-b-2 border-white w-6 h-6 rounded-full animate-spin"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700 z-20"
              aria-label="Hapus file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-1 py-4">
            <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Seret & Lepas gambar di sini
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              atau Klik untuk memilih file
            </p>
          </div>
        )}
      </div>

      {/* Loader CSS */}
      <style jsx>{`
        .loader {
          border-top-color: transparent;
          border-right-color: white;
          border-left-color: white;
          border-bottom-color: white;
        }
      `}</style>
    </div>
  );
};
