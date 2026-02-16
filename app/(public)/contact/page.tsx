import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import { getLocalizedField } from '@/lib/localize';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/contact/ContactForm';
import { FadeIn } from '@/components/animations/FadeIn';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

// Disable caching to ensure fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('contact');
  return {
    title: t('pageTitle'),
    description: t('heroDescription'),
  };
}

async function getContactData() {
  const contactInfo = await prisma.contactInfo.findFirst();
  return { contactInfo };
}

export default async function ContactPage() {
  const locale = await getLocale() as 'en' | 'ar';
  const t = await getTranslations('contact');
  const { contactInfo } = await getContactData();

  // Get localized contact info
  const localizedAddress = getLocalizedField(contactInfo, 'address', locale, '123 Architecture Avenue');
  const localizedCity = getLocalizedField(contactInfo, 'city', locale, 'New York');
  const localizedCountry = getLocalizedField(contactInfo, 'country', locale, 'United States');
  const localizedOfficeHours = getLocalizedField(contactInfo, 'officeHours', locale, 'Monday - Friday: 9:00 AM - 6:00 PM');

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-20 bg-cream">
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
              {t('heroDescription')}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Contact section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact info */}
            <div className="lg:col-span-2">
              <FadeIn>
                <h2 className="font-display text-3xl text-stone-900 mb-8">
                  {t('contactInfo')}
                </h2>
              </FadeIn>

              <div className="space-y-8">
                {/* Address */}
                <FadeIn delay={0.1}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-stone-100">
                      <MapPin size={20} className="text-stone-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-stone-900 mb-1">{t('address')}</h3>
                      <p className="text-stone-600">
                        {localizedAddress}
                        <br />
                        {localizedCity}, {contactInfo?.postalCode || 'NY 10001'}
                        <br />
                        {localizedCountry}
                      </p>
                      {contactInfo?.mapLink && (
                        <a
                          href={contactInfo.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-stone-900 hover:text-stone-600 transition-colors group"
                        >
                          <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
                          {t('viewOnMap')}
                        </a>
                      )}
                    </div>
                  </div>
                </FadeIn>

                {/* Phone */}
                <FadeIn delay={0.15}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-stone-100">
                      <Phone size={20} className="text-stone-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-stone-900 mb-1">{t('phone')}</h3>
                      <a
                        href={`tel:${(contactInfo?.phone || '+1 (555) 123-4567').replace(/\s/g, '')}`}
                        className="text-stone-600 hover:text-stone-900 transition-colors"
                        dir="ltr"
                      >
                        {contactInfo?.phone || '+1 (555) 123-4567'}
                      </a>
                    </div>
                  </div>
                </FadeIn>

                {/* Email */}
                <FadeIn delay={0.2}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-stone-100">
                      <Mail size={20} className="text-stone-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-stone-900 mb-1">{t('email')}</h3>
                      <a
                        href={`mailto:${contactInfo?.email || 'hello@archcodeengineer.com'}`}
                        className="text-stone-600 hover:text-stone-900 transition-colors"
                        dir="ltr"
                      >
                        {contactInfo?.email || 'hello@archcodeengineer.com'}
                      </a>
                    </div>
                  </div>
                </FadeIn>

                {/* Office Hours */}
                <FadeIn delay={0.25}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-stone-100">
                      <Clock size={20} className="text-stone-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-stone-900 mb-1">{t('officeHours')}</h3>
                      <p className="text-stone-600">
                        {localizedOfficeHours}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Map Link Button - Large CTA */}
              {contactInfo?.mapLink && (
                <FadeIn delay={0.3}>
                  <a
                    href={contactInfo.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-10 flex items-center justify-center gap-3 w-full py-4 bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                  >
                    <MapPin size={20} />
                    <span className="font-medium">{t('getDirections')}</span>
                    <ExternalLink size={16} />
                  </a>
                </FadeIn>
              )}
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <FadeIn delay={0.1}>
                <div className="bg-stone-50 p-8 md:p-12">
                  <h2 className="font-display text-3xl text-stone-900 mb-2">
                    {t('sendMessage')}
                  </h2>
                  <p className="text-stone-600 mb-8">
                    {t('formDescription')}
                  </p>
                  <ContactForm />
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {/* Location Banner */}
      <section className="bg-stone-900 py-16">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-start">
              <h3 className="font-display text-2xl text-white mb-2">
                {t('visitStudio')}
              </h3>
              <p className="text-stone-400">
                {localizedAddress}, {localizedCity}
              </p>
            </div>
            {contactInfo?.mapLink && (
              <a
                href={contactInfo.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-stone-900 hover:bg-stone-100 transition-colors font-medium"
              >
                <MapPin size={20} />
                {t('openInMaps')}
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
