import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, locales, Locale } from '@/i18n.config';

export default getRequestConfig(async () => {
  // Try to get locale from cookie first
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  
  // Validate the locale
  let locale: Locale = defaultLocale;
  
  if (localeCookie && locales.includes(localeCookie as Locale)) {
    locale = localeCookie as Locale;
  } else {
    // Try to detect from Accept-Language header
    const headersList = headers();
    const acceptLanguage = headersList.get('accept-language');
    
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage.split(',')[0].split('-')[0];
      if (locales.includes(preferredLocale as Locale)) {
        locale = preferredLocale as Locale;
      }
    }
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});

