'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { cn } from '@/lib/utils';

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

interface ProjectsClientProps {
  projects: Project[];
  categories: string[];
}

export function ProjectsClient({ projects, categories }: ProjectsClientProps) {
  const t = useTranslations('projects');
  const tCommon = useTranslations('common');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter projects based on active category
  const filteredProjects = activeCategory
    ? projects.filter((project) => project.category === activeCategory)
    : projects;

  return (
    <>
      {/* Category filters - visible only if we have categories */}
      {categories.length > 0 && (
        <section className="py-8 bg-white border-b border-stone-200">
          <Container>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-stone-500">{tCommon('filter')}:</span>
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  activeCategory === null
                    ? 'text-stone-900 bg-stone-100'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                )}
              >
                {t('filterAll')}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'px-4 py-2 text-sm transition-colors',
                    activeCategory === category
                      ? 'font-medium text-stone-900 bg-stone-100'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Projects grid */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProjects.map((project, idx) => (
                <ProjectCard
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
          ) : (
            <div className="text-center py-20">
              <p className="text-stone-500">{t('noProjectsInCategory')}</p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

export default ProjectsClient;

