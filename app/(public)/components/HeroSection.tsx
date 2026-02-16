'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { LineReveal } from '@/components/animations/TextReveal';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  image?: string | null;
}

export function HeroSection({ title, subtitle, image }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const titleLines = title.split(' ');

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      {image ? (
        <motion.div className="absolute inset-0" style={{ y }}>
          <Image
            src={image}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-stone-900/40" />
        </motion.div>
      ) : (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-sand-100"
          style={{ y }}
        />
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-px h-32 bg-stone-300/50" />
        <div className="absolute bottom-1/4 right-10 w-px h-32 bg-stone-300/50" />
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 text-center">
        <Container>
          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`font-display text-hero ${
              image ? 'text-white' : 'text-stone-900'
            }`}
          >
            <LineReveal
              lines={titleLines}
              lineClassName="block"
              delay={0.3}
            />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className={`mt-8 text-lg md:text-xl tracking-wide ${
              image ? 'text-white/80' : 'text-stone-600'
            }`}
          >
            {subtitle}
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className={`mt-8 mx-auto w-24 h-px ${
              image ? 'bg-white/40' : 'bg-stone-400'
            }`}
          />
        </Container>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={image ? 'text-white/60' : 'text-stone-400'}
        >
          <ArrowDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroSection;

