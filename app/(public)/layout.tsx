import { getLocale } from 'next-intl/server';
import { PublicLayout } from '@/components/layout/PublicLayout';
import prisma from '@/lib/prisma';
import { getLocalizedField } from '@/lib/localize';

// Disable caching to ensure fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getSiteData() {
  const [settings, contactInfo, socialLinks] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.contactInfo.findFirst(),
    prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  return { settings, contactInfo, socialLinks };
}

export default async function PublicRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale() as 'en' | 'ar';
  const { settings, contactInfo, socialLinks } = await getSiteData();

  return (
    <PublicLayout
      siteSettings={{
        siteName: getLocalizedField(settings, 'siteName', locale, 'Arch Code Engineer'),
        logo: settings?.logo || undefined,
      }}
      contactInfo={{
        address: getLocalizedField(contactInfo, 'address', locale),
        city: getLocalizedField(contactInfo, 'city', locale),
        country: getLocalizedField(contactInfo, 'country', locale),
        phone: contactInfo?.phone || undefined,
        email: contactInfo?.email || undefined,
      }}
      socialLinks={socialLinks.map((link) => ({
        platform: link.platform,
        url: link.url,
        icon: link.icon || undefined,
      }))}
    >
      {children}
    </PublicLayout>
  );
}

