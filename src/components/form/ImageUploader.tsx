// components/ImageUploader.tsx
'use client';

import React, { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { Input } from '@/components/ui/input'; // Pastikan path ini benar
import { Label } from '@/components/ui/label'; // Pastikan path ini benar
import { Upload, FileImage, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Pastikan Anda memiliki utility function cn

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  label?: string;
  className?: string;
  accept?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileChange,
  label = 'Upload Gambar',
  className,
  accept = 'image/*',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // --- Handlers
  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    onFileChange(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Mencegah klik menyebar ke input
    handleFileChange(null);
    // Secara opsional: reset input file secara manual jika diperlukan
    const inputElement = document.getElementById('image-upload-input') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  };

  // --- Drag and Drop Handlers
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

    // Cek apakah file adalah gambar (sederhana)
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    } else if (file) {
      alert('Hanya file gambar yang diizinkan!');
    }
  }, []);

  // --- Render
  const renderContent = () => {
    if (selectedFile) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <FileImage className="h-12 w-12 text-green-500" />
          <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {selectedFile.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700"
            aria-label="Hapus file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center space-y-1 py-4">
        <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Seret & Lepas gambar di sini
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          atau Klik untuk memilih file
        </p>
      </div>
    );
  };

  return (
    <div className={cn('grid w-full items-center gap-1.5', className)}>
      <Label htmlFor="image-upload-input" className='mb-2'>{label}</Label>
      <div
        className={cn(
          'relative w-full cursor-pointer rounded-lg border-2 border-dashed transition-colors',
          'min-h-[100px] hover:border-primary/50',
          isDragOver
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50',
          selectedFile && 'border-solid border-green-500/50 hover:border-green-500/50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          // Trigger klik input saat area diklik, hanya jika belum ada file
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
          aria-hidden="true" // Sembunyikan input secara visual
        />
        {renderContent()}
      </div>
      {/* Opsional: Tampilkan pratinjau gambar jika ada */}
      {selectedFile && (
        <div className="mt-2 flex justify-center">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Pratinjau Gambar"
            className="max-h-40 w-auto rounded-md object-cover shadow-md"
            onLoad={() => URL.revokeObjectURL(URL.createObjectURL(selectedFile))}
          />
        </div>
      )}
    </div>
  );
};