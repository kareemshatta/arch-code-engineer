import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import { getLocalizedField } from '@/lib/localize';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';
import { ProjectsClient } from './ProjectsClient';

// Disable caching to ensure fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('projects');
  return {
    title: t('pageTitle'),
    description: t('pageSubtitle'),
  };
}

async function getProjectsData() {
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return { projects };
}

export default async function ProjectsPage() {
  const locale = await getLocale() as 'en' | 'ar';
  const t = await getTranslations('projects');
  const { projects } = await getProjectsData();

  // Localize projects
  const localizedProjects = projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    thumbnail: project.thumbnail,
    year: project.year,
    title: getLocalizedField(project, 'title', locale),
    description: getLocalizedField(project, 'description', locale),
    location: getLocalizedField(project, 'location', locale),
    category: getLocalizedField(project, 'category', locale),
  }));

  // Get unique categories from localized projects
  const categories = Array.from(
    new Set(localizedProjects.map((p) => p.category).filter((c): c is string => c !== null && c !== ''))
  );

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-cream">
        <Container>
          <FadeIn>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-stone-500">
              {t('pageTitle')}
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-4 font-display text-display-lg md:text-display-xl text-stone-900 max-w-4xl">
              {locale === 'ar' ? 'المشاريع المميزة' : 'Featured Projects'}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-stone-600 max-w-2xl">
              {t('pageSubtitle')}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Client-side filters and projects grid */}
      <ProjectsClient projects={localizedProjects} categories={categories} />
    </>
  );
}

