'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Container } from './Container';

type BackgroundType = 'white' | 'cream' | 'stone' | 'dark';
type ContainerSizeType = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  containerSize?: ContainerSizeType;
  noContainer?: boolean;
  background?: BackgroundType;
  id?: string;
}

const backgrounds: Record<BackgroundType, string> = {
  white: 'bg-white',
  cream: 'bg-cream',
  stone: 'bg-stone-50',
  dark: 'bg-stone-900 text-white',
};

export function Section({
  children,
  className,
  containerClassName,
  containerSize = 'xl',
  noContainer = false,
  background = 'white',
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-20 md:py-28 lg:py-36',
        backgrounds[background],
        className
      )}
    >
      {noContainer ? (
        children
      ) : (
        <Container size={containerSize} className={containerClassName}>
          {children}
        </Container>
      )}
    </section>
  );
}

// Animated Section with motion
interface AnimatedSectionProps extends SectionProps {
  animateOnView?: boolean;
  delay?: number;
}

export function AnimatedSection({
  animateOnView = true,
  delay = 0,
  children,
  className,
  background = 'white',
  containerClassName,
  containerSize = 'xl',
  noContainer = false,
  id,
}: AnimatedSectionProps) {
  const motionProps = animateOnView
    ? {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-100px' },
        transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] },
      }
    : {};

  return (
    <motion.section
      id={id}
      className={cn(
        'py-20 md:py-28 lg:py-36',
        backgrounds[background],
        className
      )}
      {...motionProps}
    >
      {noContainer ? (
        children
      ) : (
        <Container size={containerSize} className={containerClassName}>
          {children}
        </Container>
      )}
    </motion.section>
  );
}

export default Section;
