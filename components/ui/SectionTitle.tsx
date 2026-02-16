'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'start' | 'center' | 'end';
  className?: string;
  titleClassName?: string;
  animate?: boolean;
}

export function SectionTitle({
  label,
  title,
  description,
  align = 'start',
  className,
  titleClassName,
  animate = true,
}: SectionTitleProps) {
  const alignments = {
    start: 'text-start',
    center: 'text-center mx-auto',
    end: 'text-end ms-auto',
  };

  const Wrapper = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: 'easeOut' },
      }
    : {};

  return (
    <Wrapper
      className={cn('max-w-3xl mb-16 md:mb-20', alignments[align], className)}
      {...animationProps}
    >
      {label && (
        <span className="block text-xs font-medium tracking-[0.2em] uppercase text-stone-500 mb-4">
          {label}
        </span>
      )}
      <h2
        className={cn(
          'font-display text-display-md md:text-display-lg text-stone-900',
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-6 text-lg text-stone-600 leading-relaxed">
          {description}
        </p>
      )}
    </Wrapper>
  );
}

export default SectionTitle;

