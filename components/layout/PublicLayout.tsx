'use client';

import { useLocale } from 'next-intl';
import { Header } from './Header';
import { Footer } from './Footer';

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface PublicLayoutProps {
  children: React.ReactNode;
  siteSettings?: {
    siteName?: string;
    logo?: string;
  };
  contactInfo?: {
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
    email?: string;
  };
  socialLinks?: SocialLink[];
}

export function PublicLayout({
  children,
  siteSettings,
  contactInfo,
  socialLinks,
}: PublicLayoutProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <Header
        siteName={siteSettings?.siteName}
        logo={siteSettings?.logo || undefined}
      />
      <main className="min-h-screen">{children}</main>
      <Footer
        siteName={siteSettings?.siteName}
        contactInfo={contactInfo}
        socialLinks={socialLinks}
      />
    </div>
  );
}

export default PublicLayout;

