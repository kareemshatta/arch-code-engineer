import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import { getLocalizedField } from '@/lib/localize';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { FadeIn } from '@/components/animations/FadeIn';
import { ArrowRight } from 'lucide-react';

// Disable caching to ensure fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const aboutContent = await prisma.aboutContent.findFirst();

  return {
    title: getLocalizedField(aboutContent, 'seoTitle', locale as 'en' | 'ar', 'About Us'),
    description: getLocalizedField(
      aboutContent,
      'seoDescription',
      locale as 'en' | 'ar',
      'Learn about Arch Code Engineer - our philosophy, vision, and mission.'
    ),
  };
}

async function getAboutData() {
  const aboutContent = await prisma.aboutContent.findFirst();
  return { aboutContent };
}

export default async function AboutPage() {
  const locale = await getLocale() as 'en' | 'ar';
  const t = await getTranslations('about');
  const tCommon = await getTranslations('common');
  const { aboutContent } = await getAboutData();

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
              {t('pageSubtitle')}
            </h1>
          </FadeIn>
        </Container>
      </section>

      {/* Philosophy */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <FadeIn direction="right">
              <div className="relative aspect-[4/5] bg-stone-200 overflow-hidden">
                {aboutContent?.philosophyImage ? (
                  <Image
                    src={aboutContent.philosophyImage}
                    alt={t('philosophy')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-8xl text-stone-300">P</span>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Content */}
            <div>
              <SectionTitle
                label={t('philosophy')}
                title={getLocalizedField(aboutContent, 'philosophyTitle', locale, t('philosophy'))}
                className="mb-8"
              />
              <FadeIn delay={0.2}>
                <p className="text-lg text-stone-600 leading-relaxed">
                  {getLocalizedField(
                    aboutContent,
                    'philosophyText',
                    locale,
                    'Architecture is more than constructing buildings—it\'s about crafting experiences that resonate with human emotion and enhance daily life.'
                  )}
                </p>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 md:py-32 bg-stone-50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            {/* Vision */}
            <FadeIn>
              <div className="p-10 md:p-12 bg-white border border-stone-200">
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-stone-500">
                  {t('vision')}
                </span>
                <h2 className="mt-4 font-display text-3xl md:text-4xl text-stone-900">
                  {getLocalizedField(aboutContent, 'visionTitle', locale, t('vision'))}
                </h2>
                <p className="mt-6 text-stone-600 leading-relaxed">
                  {getLocalizedField(
                    aboutContent,
                    'visionText',
                    locale,
                    'To be the leading force in architectural innovation, setting new standards for design excellence while creating sustainable spaces.'
                  )}
                </p>
              </div>
            </FadeIn>

            {/* Mission */}
            <FadeIn delay={0.15}>
              <div className="p-10 md:p-12 bg-stone-900 text-white">
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-stone-400">
                  {t('mission')}
                </span>
                <h2 className="mt-4 font-display text-3xl md:text-4xl">
                  {getLocalizedField(aboutContent, 'missionTitle', locale, t('mission'))}
                </h2>
                <p className="mt-6 text-stone-300 leading-relaxed">
                  {getLocalizedField(
                    aboutContent,
                    'missionText',
                    locale,
                    'We deliver exceptional architectural solutions by combining cutting-edge technology with timeless design principles.'
                  )}
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <SectionTitle
            label={t('values')}
            title={locale === 'ar' ? 'ما يدفعنا' : 'What Drives Us'}
            align="center"
            className="max-w-2xl"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                number: '01',
                title: t('value1Title'),
                description: t('value1Text'),
              },
              {
                number: '02',
                title: t('value2Title'),
                description: t('value2Text'),
              },
              {
                number: '03',
                title: t('value3Title'),
                description: t('value3Text'),
              },
            ].map((value, idx) => (
              <FadeIn key={value.number} delay={idx * 0.1}>
                <div className="text-center p-8">
                  <span className="font-mono text-sm text-stone-400">
                    {value.number}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-stone-900">
                    {value.title}
                  </h3>
                  <p className="mt-4 text-stone-600">{value.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-cream border-t border-stone-200">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <FadeIn>
                <h2 className="font-display text-3xl md:text-4xl text-stone-900">
                  {locale === 'ar' ? 'هل أنت مستعد لبدء مشروعك؟' : 'Ready to start your project?'}
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="mt-4 text-stone-600">
                  {locale === 'ar' ? 'دعنا نناقش كيف يمكننا تحويل رؤيتك إلى واقع.' : "Let's discuss how we can bring your vision to life."}
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={0.2}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 text-white font-medium tracking-wider uppercase text-sm hover:bg-stone-800 transition-colors"
              >
                <span>{tCommon('getInTouch')}</span>
                <ArrowRight size={18} className="rtl-flip" />
              </Link>
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  );
}

