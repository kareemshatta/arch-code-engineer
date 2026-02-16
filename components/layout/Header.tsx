'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface HeaderProps {
  siteName?: string;
  logo?: string;
}

export function Header({ siteName = 'Arch Code Engineer', logo }: HeaderProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/services', label: t('services') },
    { href: '/projects', label: t('projects') },
    { href: '/contact', label: t('contact') },
  ];

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-sm py-4'
            : 'bg-transparent py-6'
        )}
      >
        <Container>
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="relative z-50 font-display text-xl md:text-2xl tracking-tight"
            >
              {logo ? (
                <img src={logo} alt={siteName} className="h-8 md:h-10" />
              ) : (
                <span className={cn(isOpen ? 'text-white' : 'text-stone-900')}>
                  {siteName}
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <ul className="flex items-center gap-8">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'text-sm tracking-wider uppercase transition-colors duration-300 link-underline',
                        pathname === item.href
                          ? 'text-stone-900'
                          : 'text-stone-500 hover:text-stone-900'
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Language Switcher - Desktop */}
              <div className="border-s border-stone-300 ps-4">
                <LanguageSwitcher variant="minimal" />
              </div>
            </div>

            {/* Mobile Menu Button & Language */}
            <div className="flex items-center gap-2 md:hidden">
              <LanguageSwitcher variant="minimal" className={cn(isOpen && 'hidden')} />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  'relative z-50 p-2 transition-colors',
                  isOpen ? 'text-white' : 'text-stone-900'
                )}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-stone-900"
          >
            <Container className="h-full flex flex-col justify-center">
              <nav>
                <ul className="space-y-6">
                  {navItems.map((item, idx) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-start"
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          'block font-display text-4xl md:text-5xl text-white transition-opacity',
                          pathname === item.href
                            ? 'opacity-100'
                            : 'opacity-60 hover:opacity-100'
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Mobile menu footer with language switcher */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 pt-8 border-t border-white/20 text-start"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-white/60 text-sm">
                    {t('language')}:
                  </span>
                  <LanguageSwitcher variant="minimal" className="[&_button]:text-white [&_button]:hover:text-white/80 [&_button.active]:bg-white/20" />
                </div>
                <p className="text-white/60 text-sm">
                  hello@archcodeengineer.com
                </p>
                <p className="text-white/60 text-sm mt-1">
                  +1 (555) 123-4567
                </p>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
