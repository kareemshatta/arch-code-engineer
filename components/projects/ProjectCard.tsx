'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  title: string;
  slug: string;
  description: string;
  thumbnail?: string | null;
  category?: string | null;
  location?: string | null;
  year?: string | null;
  index?: number;
}

export function ProjectCard({
  title,
  slug,
  description,
  thumbnail,
  category,
  location,
  year,
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link href={`/projects/${slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-200 mb-6">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-stone-400 font-display text-2xl">
                {title.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-stone-900/0 transition-all duration-500 group-hover:bg-stone-900/20" />
          
          {/* View project indicator */}
          <div className="absolute bottom-4 end-4 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <ArrowUpRight size={20} className="text-stone-900 rtl-flip" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs tracking-wider uppercase text-stone-500">
            {category && <span>{category}</span>}
            {category && (location || year) && <span>·</span>}
            {location && <span>{location}</span>}
            {location && year && <span>·</span>}
            {year && <span>{year}</span>}
          </div>

          {/* Title */}
          <h3 className="font-display text-2xl md:text-3xl text-stone-900 group-hover:text-stone-700 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-stone-600 line-clamp-2">{description}</p>
        </div>
      </Link>
    </motion.article>
  );
}

// Featured project card with larger layout
export function FeaturedProjectCard({
  title,
  slug,
  description,
  thumbnail,
  category,
  location,
  year,
  index = 0,
}: ProjectCardProps) {
  const t = useTranslations('projects');
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        'group',
        index === 0 ? 'md:col-span-2 md:row-span-2' : ''
      )}
    >
      <Link href={`/projects/${slug}`} className="block h-full">
        <div
          className={cn(
            'relative overflow-hidden bg-stone-200 h-full min-h-[300px]',
            index === 0 ? 'md:aspect-auto aspect-[4/3]' : 'aspect-[4/3]'
          )}
        >
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes={index === 0 ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
              priority={index === 0}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-stone-400 font-display text-4xl">
                {title.charAt(0)}
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 inset-x-0 p-6 md:p-10">
            {/* Meta */}
            <div className="flex items-center gap-3 text-xs tracking-wider uppercase text-white/70 mb-3">
              {category && <span>{category}</span>}
              {category && location && <span>·</span>}
              {location && <span>{location}</span>}
            </div>

            {/* Title */}
            <h3
              className={cn(
                'font-display text-white',
                index === 0 ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'
              )}
            >
              {title}
            </h3>

            {index === 0 && (
              <p className="mt-4 text-white/80 max-w-xl line-clamp-2 hidden md:block">
                {description}
              </p>
            )}

            {/* View project link */}
            <div className="mt-4 inline-flex items-center gap-2 text-white text-sm tracking-wider uppercase opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
              <span>{t('viewProject')}</span>
              <ArrowUpRight size={16} className="rtl-flip" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default ProjectCard;

