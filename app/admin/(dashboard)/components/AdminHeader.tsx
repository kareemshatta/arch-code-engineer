'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ChevronDown } from 'lucide-react';

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const t = useTranslations('admin');

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Page title */}
        <div className="lg:ms-0 ms-12">
          <h2 className="text-lg font-medium text-stone-900 text-start">
            {t('dashboard')}
          </h2>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center">
              <User size={16} className="text-stone-600" />
            </div>
            <div className="hidden sm:block text-start">
              <p className="text-sm font-medium text-stone-900">
                {user.name || 'Admin'}
              </p>
              <p className="text-xs text-stone-500">{user.email}</p>
            </div>
            <ChevronDown size={16} className="text-stone-400" />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsDropdownOpen(false)}
                  className="fixed inset-0 z-40"
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 end-0 w-48 bg-white shadow-lg border border-stone-200 z-50"
                >
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>{t('logout')}</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
