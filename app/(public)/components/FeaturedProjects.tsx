'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { FeaturedProjectCard } from '@/components/projects/ProjectCard';
import { FadeIn } from '@/components/animations/FadeIn';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  category: string | null;
  location: string | null;
  year: string | null;
}

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const t = useTranslations('home');
  
  if (projects.length === 0) return null;

  return (
    <section className="py-24 md:py-36 bg-cream">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <SectionTitle
            label={t('featuredProjects')}
            title={t('featuredProjects')}
            className="mb-0"
          />
          <FadeIn delay={0.2}>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-stone-900 font-medium tracking-wider uppercase text-sm group"
            >
              <span>{t('viewAllProjects')}</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl-flip"
              />
            </Link>
          </FadeIn>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <FeaturedProjectCard
              key={project.id}
              title={project.title}
              slug={project.slug}
              description={project.description}
              thumbnail={project.thumbnail}
              category={project.category}
              location={project.location}
              year={project.year}
              index={idx}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FeaturedProjects;

