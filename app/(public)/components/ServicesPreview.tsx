'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ServiceCardCompact } from '@/components/services/ServiceCard';
import { FadeIn } from '@/components/animations/FadeIn';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
}

interface ServicesPreviewProps {
  services: Service[];
}

export function ServicesPreview({ services }: ServicesPreviewProps) {
  const t = useTranslations('home');
  const tServices = useTranslations('services');
  
  if (services.length === 0) return null;

  return (
    <section className="py-24 md:py-36 bg-stone-50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* First column - Title (appears on right in RTL) */}
          <div>
            <SectionTitle
              label={t('ourServices')}
              title={t('ourServices')}
              description={tServices('pageSubtitle')}
              className="mb-0 lg:sticky lg:top-32"
            />

            <FadeIn delay={0.3} className="mt-8 hidden lg:block">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-stone-900 font-medium tracking-wider uppercase text-sm group"
              >
                <span>{t('viewAllServices')}</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl-flip"
                />
              </Link>
            </FadeIn>
          </div>

          {/* Second column - Services list (appears on left in RTL) */}
          <div className="space-y-10">
            {services.map((service, idx) => (
              <ServiceCardCompact
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon || undefined}
                index={idx}
              />
            ))}
            
            {/* Mobile/Tablet link - inside services column for better RTL alignment */}
            <FadeIn delay={0.4} className="lg:hidden pt-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-stone-900 font-medium tracking-wider uppercase text-sm group"
              >
                <span>{t('viewAllServices')}</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl-flip"
                />
              </Link>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ServicesPreview;

