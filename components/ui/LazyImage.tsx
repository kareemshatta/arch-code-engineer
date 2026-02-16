'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LazyImageProps extends Omit<ImageProps, 'onLoad'> {
  fallback?: React.ReactNode;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'video' | string;
  showPlaceholder?: boolean;
  placeholderColor?: string;
}

const aspectRatios = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  video: 'aspect-video',
};

export function LazyImage({
  src,
  alt,
  className,
  fallback,
  aspectRatio = 'landscape',
  showPlaceholder = true,
  placeholderColor = 'bg-stone-200',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const aspectClass =
    typeof aspectRatio === 'string' && aspectRatio in aspectRatios
      ? aspectRatios[aspectRatio as keyof typeof aspectRatios]
      : aspectRatio;

  if (hasError || !src) {
    return (
      <div
        className={cn(
          'relative overflow-hidden flex items-center justify-center',
          placeholderColor,
          aspectClass,
          className
        )}
      >
        {fallback || (
          <span className="text-stone-400 font-display text-4xl">
            {alt?.charAt(0) || '?'}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', aspectClass, className)}>
      {/* Placeholder */}
      {showPlaceholder && !isLoaded && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse',
            placeholderColor
          )}
        />
      )}

      {/* Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={cn('object-cover', className)}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          {...props}
        />
      </motion.div>
    </div>
  );
}

export default LazyImage;
