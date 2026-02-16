'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Settings,
  FileText,
  FolderOpen,
  Mail,
  Share2,
  Search,
  Menu,
  X,
  Home,
  Info,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const t = useTranslations('admin');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const navItems = [
    { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/admin/settings', label: t('settings'), icon: Settings },
    { href: '/admin/home', label: t('home'), icon: Home },
    { href: '/admin/about', label: t('about'), icon: Info },
    { href: '/admin/services', label: t('services'), icon: Wrench },
    { href: '/admin/projects', label: t('projects'), icon: FolderOpen },
    { href: '/admin/contact', label: t('contact'), icon: Mail },
    { href: '/admin/social', label: t('social'), icon: Share2 },
    { href: '/admin/submissions', label: t('submissions'), icon: FileText },
    { href: '/admin/seo', label: t('seo'), icon: Search },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 start-4 z-50 p-2 bg-white shadow-md"
      >
        <Menu size={24} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 start-0 z-50 h-full w-64 bg-stone-900 text-white transition-transform duration-300',
          isMobileOpen 
            ? 'translate-x-0' 
            : isRTL 
              ? 'translate-x-full lg:translate-x-0' 
              : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 end-4 p-2 text-stone-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-stone-800">
          <Link href="/admin" className="block">
            <h1 className="font-display text-xl text-start">
              {t('brandName')}
            </h1>
            <p className="text-xs text-stone-500 mt-1 text-start">
              {t('adminPanel')}
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-stone-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 inset-x-0 border-t border-stone-800">
          {/* Language Switcher */}
          <div className="px-4 py-3 border-b border-stone-800">
            <LanguageSwitcher variant="minimal" className="justify-center [&_button]:text-stone-400 [&_button]:hover:text-white" />
          </div>
          
          {/* View site link */}
          <div className="p-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-stone-400 hover:text-white transition-colors"
            >
              <span>{t('viewWebsite')}</span>
              <svg
                className="w-4 h-4 rtl-flip"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
