'use client';

import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

// Character by character reveal
export function TextReveal({
  children,
  className,
  delay = 0,
  as: Component = 'span',
}: TextRevealProps) {
  const words = children.split(' ');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay },
    }),
  };

  const childVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.span
      className={cn('inline-flex flex-wrap', className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, idx) => (
        <motion.span key={idx} variants={childVariants} className="mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Line by line reveal
interface LineRevealProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}

export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
}: LineRevealProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: delay,
      },
    },
  };

  const lineVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {lines.map((line, idx) => (
        <div key={idx} className="overflow-hidden">
          <motion.div variants={lineVariants} className={lineClassName}>
            {line}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

export default TextReveal;

