'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  Settings,
  Map,
  Palette,
  Leaf,
  ClipboardList,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: string;
  index?: number;
}

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Settings,
  Map,
  Palette,
  Leaf,
  ClipboardList,
};

export function ServiceCard({
  title,
  description,
  icon,
  index = 0,
}: ServiceCardProps) {
  const IconComponent = icon ? iconMap[icon] : Building2;

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
      className="group"
    >
      <div className="p-8 md:p-10 border border-stone-200 bg-white transition-all duration-500 hover:border-stone-400 hover:shadow-lg">
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center bg-stone-100 text-stone-600 mb-6 transition-colors duration-500 group-hover:bg-stone-900 group-hover:text-white">
          {IconComponent && <IconComponent size={28} strokeWidth={1.5} />}
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl md:text-3xl text-stone-900 mb-4">
          {title}
        </h3>

        {/* Description */}
        <p className="text-stone-600 leading-relaxed">{description}</p>
      </div>
    </motion.article>
  );
}

// Compact service card for homepage
export function ServiceCardCompact({
  title,
  description,
  icon,
  index = 0,
}: ServiceCardProps) {
  const IconComponent = icon ? iconMap[icon] : Building2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-stone-100 text-stone-600">
        {IconComponent && <IconComponent size={20} strokeWidth={1.5} />}
      </div>
      <div>
        <h4 className="font-display text-xl text-stone-900 mb-1">{title}</h4>
        <p className="text-stone-500 text-sm line-clamp-2">{description}</p>
      </div>
    </motion.div>
  );
}

export default ServiceCard;

