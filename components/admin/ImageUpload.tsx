'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  label?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'video';
  className?: string;
}

const aspectRatios = {
  square: 'aspect-square',
  landscape: 'aspect-[16/9]',
  portrait: 'aspect-[3/4]',
  video: 'aspect-video',
};

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = 'general',
  label = 'Upload Image',
  aspectRatio = 'landscape',
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid image (JPEG, PNG, WebP, or GIF)');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB');
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Upload failed');
        }

        const data = await response.json();
        onChange(data.url);
      } catch (err: any) {
        setError(err.message || 'Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleRemove = () => {
    onChange('');
    onRemove?.();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium tracking-wider uppercase text-stone-500 mb-2">
          {label}
        </label>
      )}

      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn('relative bg-stone-100 overflow-hidden', aspectRatios[aspectRatio])}
          >
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={cn(
                'relative border-2 border-dashed cursor-pointer transition-colors',
                aspectRatios[aspectRatio],
                isDragActive
                  ? 'border-stone-900 bg-stone-100'
                  : 'border-stone-300 hover:border-stone-400 bg-stone-50',
                isUploading && 'cursor-not-allowed opacity-60'
              )}
            >
              <input {...getInputProps()} />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {isUploading ? (
                  <>
                    <Loader2 size={32} className="text-stone-400 animate-spin mb-2" />
                    <p className="text-sm text-stone-500">Uploading...</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center mb-3">
                      {isDragActive ? (
                        <ImageIcon size={24} className="text-stone-500" />
                      ) : (
                        <Upload size={24} className="text-stone-500" />
                      )}
                    </div>
                    <p className="text-sm text-stone-600 text-center">
                      {isDragActive ? (
                        'Drop image here'
                      ) : (
                        <>
                          <span className="font-medium">Click to upload</span> or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      PNG, JPG, WebP or GIF (max 10MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

// Multiple image upload component
interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  maxImages?: number;
}

export function MultiImageUpload({
  values = [],
  onChange,
  folder = 'gallery',
  label = 'Upload Images',
  maxImages = 20,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (values.length + acceptedFiles.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      setIsUploading(true);
      setError(null);

      const newUrls: string[] = [];

      for (const file of acceptedFiles) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', folder);

          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            newUrls.push(data.url);
          }
        } catch (err) {
          console.error('Failed to upload:', file.name);
        }
      }

      onChange([...values, ...newUrls]);
      setIsUploading(false);
    },
    [values, onChange, folder, maxImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif'],
    },
    disabled: isUploading || values.length >= maxImages,
  });

  const handleRemove = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium tracking-wider uppercase text-stone-500 mb-2">
          {label}
        </label>
      )}

      {/* Existing images grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {values.map((url, index) => (
            <div key={index} className="relative aspect-square bg-stone-100 group">
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {values.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed p-8 cursor-pointer transition-colors text-center',
            isDragActive
              ? 'border-stone-900 bg-stone-100'
              : 'border-stone-300 hover:border-stone-400 bg-stone-50',
            isUploading && 'cursor-not-allowed opacity-60'
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={20} className="animate-spin text-stone-500" />
              <span className="text-stone-600">Uploading...</span>
            </div>
          ) : (
            <>
              <Upload size={24} className="mx-auto text-stone-400 mb-2" />
              <p className="text-sm text-stone-600">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {values.length}/{maxImages} images • PNG, JPG, WebP or GIF
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export default ImageUpload;

