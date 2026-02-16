'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { locales, localeNames, Locale, localeDirection } from '@/i18n.config';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    // Set cookie for the new locale
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    
    // Hard reload to ensure fresh data with new locale
    window.location.reload();
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={`px-2 py-1 text-sm font-medium transition-colors ${
              locale === loc
                ? 'text-stone-900 bg-stone-100'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {localeNames[loc]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
        aria-label="Select language"
      >
        <Globe size={18} />
        <span>{localeNames[locale]}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full end-0 mt-2 bg-white shadow-lg border border-stone-200 min-w-[150px] z-50"
          >
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-stone-50 transition-colors ${
                  locale === loc ? 'text-stone-900 font-medium' : 'text-stone-600'
                }`}
                dir={localeDirection[loc]}
              >
                <span>{localeNames[loc]}</span>
                {locale === loc && <Check size={16} className="text-stone-900" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSwitcher;

