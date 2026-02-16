'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';

interface IntroSectionProps {
  title: string;
  text: string;
  image?: string | null;
}

export function IntroSection({ title, text, image }: IntroSectionProps) {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  return (
    <section className="py-24 md:py-36 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1">
            <FadeIn>
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-stone-500">
                {t('introSection')}
              </span>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 className="mt-4 font-display text-display-md md:text-display-lg text-stone-900">
                {title}
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-8 text-lg text-stone-600 leading-relaxed">
                {text}
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-stone-900 font-medium tracking-wider uppercase text-sm group"
              >
                <span>{tCommon('learnMore')}</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl-flip"
                />
              </Link>
            </FadeIn>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <FadeIn direction="left">
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-200">
                {image ? (
                  <Image
                    src={image}
                    alt="About Arch Code Engineer"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="font-display text-6xl text-stone-300">A</span>
                      <p className="mt-4 text-stone-400 text-sm">Architecture Studio</p>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default IntroSection;

