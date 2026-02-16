import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import prisma from '@/lib/prisma';
import { getLocalizedField } from '@/lib/localize';
import { HeroSection } from './components/HeroSection';
import { IntroSection } from './components/IntroSection';
import { FeaturedProjects } from './components/FeaturedProjects';
import { ServicesPreview } from './components/ServicesPreview';
import { CTASection } from './components/CTASection';

// Disable caching to ensure fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const homeContent = await prisma.homeContent.findFirst();
  const settings = await prisma.siteSettings.findFirst();

  return {
    title: getLocalizedField(homeContent, 'seoTitle', locale as 'en' | 'ar') || 
           getLocalizedField(settings, 'seoTitle', locale as 'en' | 'ar') || 
           'Arch Code Engineer',
    description:
      getLocalizedField(homeContent, 'seoDescription', locale as 'en' | 'ar') ||
      getLocalizedField(settings, 'seoDescription', locale as 'en' | 'ar') ||
      'Premium architectural design studio',
  };
}

async function getHomeData() {
  const [homeContent, featuredProjects, services] = await Promise.all([
    prisma.homeContent.findFirst(),
    prisma.project.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { order: 'asc' },
      take: 3,
    }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 3,
    }),
  ]);

  return { homeContent, featuredProjects, services };
}

export default async function HomePage() {
  const locale = await getLocale() as 'en' | 'ar';
  const { homeContent, featuredProjects, services } = await getHomeData();

  // Localize projects
  const localizedProjects = featuredProjects.map((project) => ({
    ...project,
    title: getLocalizedField(project, 'title', locale),
    description: getLocalizedField(project, 'description', locale),
    location: getLocalizedField(project, 'location', locale),
    category: getLocalizedField(project, 'category', locale),
  }));

  // Localize services
  const localizedServices = services.map((service) => ({
    ...service,
    title: getLocalizedField(service, 'title', locale),
    description: getLocalizedField(service, 'description', locale),
  }));

  return (
    <>
      <HeroSection
        title={getLocalizedField(homeContent, 'heroTitle', locale, 'Arch Code Engineer')}
        subtitle={getLocalizedField(homeContent, 'heroSubtitle', locale, 'Where Architecture Meets Innovation')}
        image={homeContent?.heroImage}
      />

      <IntroSection
        title={getLocalizedField(homeContent, 'introTitle', locale, 'Crafting Exceptional Spaces')}
        text={getLocalizedField(
          homeContent,
          'introText',
          locale,
          'We are a forward-thinking architectural studio dedicated to creating spaces that inspire, function beautifully, and stand the test of time.'
        )}
        image={homeContent?.introImage}
      />

      <FeaturedProjects projects={localizedProjects} />

      <ServicesPreview services={localizedServices} />

      <CTASection />
    </>
  );
}

