import { Metadata } from 'next';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import { getLocalizedField } from '@/lib/localize';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ServiceCard } from '@/components/services/ServiceCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { ArrowRight } from 'lucide-react';

// Disable caching to ensure fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('services');
  return {
    title: t('pageTitle'),
    description: t('pageSubtitle'),
  };
}

async function getServicesData() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return { services };
}

export default async function ServicesPage() {
  const locale = await getLocale() as 'en' | 'ar';
  const t = await getTranslations('services');
  const { services } = await getServicesData();

  // Localize services
  const localizedServices = services.map((service) => ({
    ...service,
    title: getLocalizedField(service, 'title', locale),
    description: getLocalizedField(service, 'description', locale),
  }));

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
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-stone-600 max-w-2xl">
              {locale === 'ar' 
                ? 'من المفهوم الأولي إلى البناء النهائي، نقدم خدمات معمارية وهندسية شاملة مصممة لرؤيتك الفريدة.'
                : 'From initial concept to final construction, we provide end-to-end architectural and engineering services tailored to your unique vision.'}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Services grid */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localizedServices.map((service, idx) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon || undefined}
                index={idx}
              />
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-20">
              <p className="text-stone-500">
                {locale === 'ar' ? 'لا توجد خدمات متاحة حالياً.' : 'No services available at the moment.'}
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Process section */}
      <section className="py-20 md:py-32 bg-stone-50">
        <Container>
          <SectionTitle
            label={t('ourProcess')}
            title={locale === 'ar' ? 'كيف نعمل' : 'How We Work'}
            description={locale === 'ar' 
              ? 'نهجنا التعاوني يضمن تحقيق رؤيتك بدقة وعناية.'
              : 'Our collaborative approach ensures your vision is realized with precision and care.'}
            align="center"
            className="max-w-2xl"
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: t('processStep1Title'),
                description: t('processStep1Text'),
              },
              {
                step: '02',
                title: t('processStep2Title'),
                description: t('processStep2Text'),
              },
              {
                step: '03',
                title: t('processStep3Title'),
                description: t('processStep3Text'),
              },
              {
                step: '04',
                title: t('processStep4Title'),
                description: t('processStep4Text'),
              },
            ].map((item, idx) => (
              <FadeIn key={item.step} delay={idx * 0.1}>
                <div className="relative flex flex-col items-center md:items-start">
                  {/* Step number with connector line */}
                  <div className="relative">
                    <span className="inline-flex items-center justify-center w-16 h-16 bg-stone-900 text-white font-mono text-sm">
                      {item.step}
                    </span>
                    {/* Connector line - extends from end of step box to the next step */}
                    {idx < 3 && (
                      <div 
                        className="hidden md:block absolute top-1/2 -translate-y-1/2 h-px bg-stone-300"
                        style={{
                          width: 'calc(100% + 2rem)',
                          insetInlineStart: '100%',
                        }}
                      />
                    )}
                  </div>
                  
                  <h3 className="mt-6 font-display text-2xl text-stone-900 text-center md:text-start">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-stone-600 text-center md:text-start">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-stone-900 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <h2 className="font-display text-display-md md:text-display-lg">
                {t('ctaTitle')}
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-6 text-lg text-stone-400">
                {t('ctaDescription')}
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-900 font-medium tracking-wider uppercase text-sm hover:bg-stone-100 transition-colors"
                >
                  <span>{locale === 'ar' ? 'ابدأ مشروعك' : 'Start a Project'}</span>
                  <ArrowRight size={18} className="rtl-flip" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-8 py-4 text-white font-medium tracking-wider uppercase text-sm hover:bg-white/10 transition-colors"
                >
                  <span>{locale === 'ar' ? 'شاهد أعمالنا' : 'View Our Work'}</span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  );
}

