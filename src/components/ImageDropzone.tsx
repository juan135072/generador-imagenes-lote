"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ImageDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
}

export function ImageDropzone({ onFilesAdded, className, disabled }: ImageDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      onFilesAdded(acceptedFiles);
    }
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={twMerge(
        clsx(
          "relative flex flex-col items-center justify-center w-full min-h-[250px] rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out cursor-pointer overflow-hidden",
          "hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
          isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[0.99]" : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50",
          disabled && "opacity-50 cursor-not-allowed hover:border-zinc-200 hover:bg-transparent"
        ),
        className
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className={clsx(
          "p-4 rounded-full transition-colors",
          isDragActive ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
        )}>
          {isDragActive ? (
            <Upload className="w-8 h-8 animate-bounce" />
          ) : (
            <ImageIcon className="w-8 h-8" />
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            {isDragActive ? "Suelta las imágenes aquí" : "Arrastra y suelta tus imágenes"}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            o haz clic para seleccionar archivos (JPG, PNG, WEBP)
          </p>
        </div>

        {!isDragActive && (
          <button className="px-4 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg hover:opacity-90 transition-opacity">
            Seleccionar Archivos
          </button>
        )}
      </div>
    </div>
  );
}

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

export function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!preview) return null;

  return (
    <div className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
      <Image
        src={preview}
        alt={file.name}
        fill
        className="object-cover transition-transform group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
        title="Eliminar imagen"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-xs text-white truncate px-1">
          {file.name}
        </p>
      </div>
    </div>
  );
}
