'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface FooterProps {
  siteName?: string;
  contactInfo?: {
    address?: string;
    addressAr?: string;
    city?: string;
    cityAr?: string;
    country?: string;
    countryAr?: string;
    phone?: string;
    email?: string;
  };
  socialLinks?: SocialLink[];
}

const defaultSocialLinks: SocialLink[] = [
  { platform: 'Instagram', url: 'https://instagram.com', icon: 'Instagram' },
  { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
  { platform: 'Twitter', url: 'https://twitter.com', icon: 'Twitter' },
];

const getIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    Instagram: <Instagram size={20} />,
    Linkedin: <Linkedin size={20} />,
    Twitter: <Twitter size={20} />,
  };
  return icons[iconName] || null;
};

export function Footer({
  siteName = 'Arch Code Engineer',
  contactInfo,
  socialLinks = defaultSocialLinks,
}: FooterProps) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: '/', label: tNav('home') },
    { href: '/about', label: tNav('about') },
    { href: '/services', label: tNav('services') },
    { href: '/projects', label: tNav('projects') },
    { href: '/contact', label: tNav('contact') },
  ];

  // Get localized contact info
  const localizedAddress = isRTL ? (contactInfo?.addressAr || contactInfo?.address) : contactInfo?.address;
  const localizedCity = isRTL ? (contactInfo?.cityAr || contactInfo?.city) : contactInfo?.city;
  const localizedCountry = isRTL ? (contactInfo?.countryAr || contactInfo?.country) : contactInfo?.country;
  const separator = isRTL ? '، ' : ', ';

  return (
    <footer className="bg-stone-900 text-white">
      {/* Main footer */}
      <Container className="py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-start">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-block font-display text-3xl md:text-4xl tracking-tight mb-6"
            >
              {siteName}
            </Link>
            <p className="text-stone-400 max-w-md leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-stone-500 mb-6">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-stone-500 mb-6">
              {t('contactUs')}
            </h4>
            <ul className="space-y-3">
              {localizedAddress && (
                <li className="flex items-start gap-3 text-stone-400">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                  <span>
                    {localizedAddress}
                    {localizedCity && <>{separator}{localizedCity}</>}
                    {localizedCountry && <>{separator}{localizedCountry}</>}
                  </span>
                </li>
              )}
              {contactInfo?.phone && (
                <li>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 text-stone-400 hover:text-white transition-colors"
                  >
                    <Phone size={18} />
                    <span dir="ltr">{contactInfo.phone}</span>
                  </a>
                </li>
              )}
              {contactInfo?.email && (
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-3 text-stone-400 hover:text-white transition-colors"
                  >
                    <Mail size={18} />
                    <span dir="ltr">{contactInfo.email}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <Container className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">
            © {currentYear} {siteName}. {t('copyright')}
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-white transition-colors duration-300"
                aria-label={link.platform}
              >
                {link.icon ? getIcon(link.icon) : link.platform}
              </a>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
