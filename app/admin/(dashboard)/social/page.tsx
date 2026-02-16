'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  Check,
  X,
  AlertCircle,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  order: number;
  isActive: boolean;
}

const platformIcons: Record<string, any> = {
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
};

const platformKeys = [
  'instagram',
  'linkedin',
  'twitter',
  'facebook',
  'youtube',
  'pinterest',
  'behance',
  'dribbble',
  'other',
];

const platformValues: Record<string, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  facebook: 'Facebook',
  youtube: 'YouTube',
  pinterest: 'Pinterest',
  behance: 'Behance',
  dribbble: 'Dribbble',
  other: 'Other',
};

export default function SocialLinksPage() {
  const t = useTranslations('admin');
  const tPlatforms = useTranslations('platforms');
  
  const getPlatformName = (platform: string) => {
    const key = platform.toLowerCase();
    return tPlatforms(key as any) || platform;
  };
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ platform: '', url: '', icon: '' });
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState({ platform: '', url: '', icon: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/admin/social');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Failed to fetch social links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCreate = async () => {
    if (!newForm.platform || !newForm.url) {
      setMessage({ type: 'error', text: t('platformUrlRequired') });
      return;
    }

    try {
      const response = await fetch('/api/admin/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newForm,
          icon: newForm.platform,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t('socialLinkCreated') });
        setShowNewForm(false);
        setNewForm({ platform: '', url: '', icon: '' });
        fetchLinks();
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('failedToCreateLink') });
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/social/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          icon: editForm.platform,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t('socialLinkUpdated') });
        setEditingId(null);
        fetchLinks();
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('failedToUpdateLink') });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDeleteLink'))) return;

    try {
      const response = await fetch(`/api/admin/social/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t('socialLinkDeleted') });
        fetchLinks();
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('failedToDeleteLink') });
    }
  };

  const handleToggleActive = async (link: SocialLink) => {
    try {
      await fetch(`/api/admin/social/${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !link.isActive }),
      });
      fetchLinks();
    } catch (error) {
      console.error('Failed to toggle link:', error);
    }
  };

  const startEditing = (link: SocialLink) => {
    setEditingId(link.id);
    setEditForm({
      platform: link.platform,
      url: link.url,
      icon: link.icon || '',
    });
  };

  const getIcon = (platform: string) => {
    const Icon = platformIcons[platform];
    return Icon ? <Icon size={20} /> : <span className="text-sm font-medium">{platform.charAt(0)}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-stone-900">{t('socialLinks')}</h1>
          <p className="mt-1 text-stone-600">{t('socialLinksDescription')}</p>
        </div>
        <Button onClick={() => setShowNewForm(true)} leftIcon={<Plus size={18} />}>
          {t('addLink')}
        </Button>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto">
            <X size={16} />
          </button>
        </motion.div>
      )}

      {/* New Link Form */}
      <AnimatePresence>
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="bg-white p-6 shadow-sm">
              <h2 className="text-lg font-medium text-stone-900 mb-4">{t('newSocialLink')}</h2>
              <div className="space-y-4">
                <select
                  value={newForm.platform}
                  onChange={(e) => setNewForm({ ...newForm, platform: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none"
                >
                  <option value="">{t('selectPlatform')}</option>
                  {platformKeys.map((key) => (
                    <option key={key} value={platformValues[key]}>
                      {getPlatformName(key)}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder={t('socialUrlPlaceholder')}
                  value={newForm.url}
                  onChange={(e) => setNewForm({ ...newForm, url: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none"
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreate}>{t('addLink')}</Button>
                  <Button variant="ghost" onClick={() => setShowNewForm(false)}>
                    {t('cancel')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links List */}
      <div className="space-y-4">
        {links.map((link) => (
          <motion.div
            key={link.id}
            layout
            className={`bg-white p-6 shadow-sm ${!link.isActive ? 'opacity-60' : ''}`}
          >
            {editingId === link.id ? (
              <div className="space-y-4">
                <select
                  value={editForm.platform}
                  onChange={(e) => setEditForm({ ...editForm, platform: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 focus:border-stone-900 focus:outline-none"
                >
                  {platformKeys.map((key) => (
                    <option key={key} value={platformValues[key]}>
                      {getPlatformName(key)}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  value={editForm.url}
                  onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 focus:border-stone-900 focus:outline-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdate(link.id)}>
                    {t('save')}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    {t('cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="p-2 text-stone-400 cursor-grab">
                  <GripVertical size={20} />
                </div>
                <div className="w-10 h-10 flex items-center justify-center bg-stone-100 text-stone-600">
                  {getIcon(link.platform)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-stone-900">{getPlatformName(link.platform)}</h3>
                  <p className="text-sm text-stone-500 truncate">{link.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(link)}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      link.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {link.isActive ? t('active') : t('inactive')}
                  </button>
                  <button
                    onClick={() => startEditing(link)}
                    className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {links.length === 0 && (
          <div className="text-center py-12 text-stone-500">
            {t('noSocialLinksYet')}
          </div>
        )}
      </div>
    </div>
  );
}

