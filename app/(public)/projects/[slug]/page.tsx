import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import { getLocalizedField } from '@/lib/localize';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';
import { ArrowLeft, ArrowRight, MapPin, Calendar, User, Maximize } from 'lucide-react';

// Disable caching to ensure fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocale();
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: getLocalizedField(project, 'seoTitle', locale as 'en' | 'ar') || 
           getLocalizedField(project, 'title', locale as 'en' | 'ar'),
    description: getLocalizedField(project, 'seoDescription', locale as 'en' | 'ar') || 
                 getLocalizedField(project, 'description', locale as 'en' | 'ar'),
  };
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

async function getProjectData(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!project || !project.isActive) {
    return null;
  }

  // Get next and previous projects
  const allProjects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: { slug: true, title: true, titleAr: true },
  });

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return { project, prevProject, nextProject };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const locale = await getLocale() as 'en' | 'ar';
  const t = await getTranslations('projects');
  const data = await getProjectData(params.slug);

  if (!data) {
    notFound();
  }

  const { project, prevProject, nextProject } = data;

  // Localize project fields
  const localizedProject = {
    ...project,
    title: getLocalizedField(project, 'title', locale),
    description: getLocalizedField(project, 'description', locale),
    fullDescription: getLocalizedField(project, 'fullDescription', locale),
    location: getLocalizedField(project, 'location', locale),
    category: getLocalizedField(project, 'category', locale),
    client: getLocalizedField(project, 'client', locale),
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-20 bg-cream">
        <Container>
          {/* Back link */}
          <FadeIn>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-8"
            >
              <ArrowLeft size={18} className="rtl-flip" />
              <span className="text-sm tracking-wider uppercase">{t('backToProjects')}</span>
            </Link>
          </FadeIn>

          {/* Meta */}
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
              {localizedProject.category && (
                <span className="px-3 py-1 bg-stone-200 text-stone-700">
                  {localizedProject.category}
                </span>
              )}
              {project.year && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {project.year}
                </span>
              )}
            </div>
          </FadeIn>

          {/* Title */}
          <FadeIn delay={0.2}>
            <h1 className="mt-6 font-display text-display-lg md:text-display-xl text-stone-900">
              {localizedProject.title}
            </h1>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={0.3}>
            <p className="mt-6 text-xl text-stone-600 max-w-3xl">
              {localizedProject.description}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Main image */}
      <section className="bg-cream pb-16 md:pb-24">
        <Container size="full" className="px-0 md:px-12 lg:px-20">
          <FadeIn delay={0.4}>
            <div className="relative aspect-[16/9] bg-stone-200 overflow-hidden">
              {project.thumbnail ? (
                <Image
                  src={project.thumbnail}
                  alt={localizedProject.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-9xl text-stone-300">
                    {localizedProject.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Project details */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <FadeIn>
                <div className="space-y-8 lg:sticky lg:top-32">
                  {/* Project info */}
                  <div>
                    <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-stone-500 mb-4">
                      {locale === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
                    </h3>
                    <dl className="space-y-4">
                      {localizedProject.location && (
                        <div className="flex items-start gap-3">
                          <MapPin size={18} className="text-stone-400 mt-0.5" />
                          <div>
                            <dt className="text-xs text-stone-500 uppercase">{t('location')}</dt>
                            <dd className="text-stone-900">{localizedProject.location}</dd>
                          </div>
                        </div>
                      )}
                      {localizedProject.client && (
                        <div className="flex items-start gap-3">
                          <User size={18} className="text-stone-400 mt-0.5" />
                          <div>
                            <dt className="text-xs text-stone-500 uppercase">{t('client')}</dt>
                            <dd className="text-stone-900">{localizedProject.client}</dd>
                          </div>
                        </div>
                      )}
                      {project.area && (
                        <div className="flex items-start gap-3">
                          <Maximize size={18} className="text-stone-400 mt-0.5" />
                          <div>
                            <dt className="text-xs text-stone-500 uppercase">{t('area')}</dt>
                            <dd className="text-stone-900">{project.area}</dd>
                          </div>
                        </div>
                      )}
                      {project.year && (
                        <div className="flex items-start gap-3">
                          <Calendar size={18} className="text-stone-400 mt-0.5" />
                          <div>
                            <dt className="text-xs text-stone-500 uppercase">{t('year')}</dt>
                            <dd className="text-stone-900">{project.year}</dd>
                          </div>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Content */}
            <div className="lg:col-span-2">
              <FadeIn delay={0.1}>
                <div className="prose prose-stone prose-lg max-w-none">
                  <p className="whitespace-pre-line">
                    {localizedProject.fullDescription || localizedProject.description}
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {/* Project gallery */}
      {project.images.length > 0 && (
        <section className="py-16 md:py-24 bg-stone-50">
          <Container>
            <FadeIn>
              <h2 className="font-display text-3xl text-stone-900 mb-12">
                {t('projectGallery')}
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((image, idx) => (
                <FadeIn key={image.id} delay={idx * 0.1}>
                  <div className="relative aspect-[4/3] bg-stone-200 overflow-hidden">
                    <Image
                      src={image.url}
                      alt={getLocalizedField(image, 'alt', locale) || `${localizedProject.title} - Image ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Navigation */}
      <section className="py-16 md:py-20 bg-white border-t border-stone-200">
        <Container>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group flex items-center gap-4"
              >
                <ArrowLeft
                  size={24}
                  className="text-stone-400 group-hover:text-stone-900 transition-colors rtl-flip"
                />
                <div>
                  <span className="text-xs tracking-wider uppercase text-stone-500">
                    {t('prevProject')}
                  </span>
                  <p className="font-display text-xl text-stone-900 group-hover:text-stone-600 transition-colors">
                    {getLocalizedField(prevProject, 'title', locale)}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex items-center gap-4 md:text-end"
              >
                <div>
                  <span className="text-xs tracking-wider uppercase text-stone-500">
                    {t('nextProject')}
                  </span>
                  <p className="font-display text-xl text-stone-900 group-hover:text-stone-600 transition-colors">
                    {getLocalizedField(nextProject, 'title', locale)}
                  </p>
                </div>
                <ArrowRight
                  size={24}
                  className="text-stone-400 group-hover:text-stone-900 transition-colors rtl-flip"
                />
              </Link>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

