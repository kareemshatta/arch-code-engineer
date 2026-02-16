'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Save, Check, AlertCircle, Search, Globe } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const seoSchema = z.object({
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

type SEOFormData = z.infer<typeof seoSchema>;

export default function SEOSettingsPage() {
  const t = useTranslations('admin');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SEOFormData>({
    resolver: zodResolver(seoSchema),
  });

  const seoTitle = watch('seoTitle');
  const seoDescription = watch('seoDescription');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          reset({
            seoTitle: data.seoTitle || '',
            seoDescription: data.seoDescription || '',
            seoKeywords: data.seoKeywords || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SEOFormData) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t('savedSuccess') });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('saveFailed') });
    } finally {
      setIsSaving(false);
    }
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
      <div className="mb-8">
        <h1 className="text-2xl font-display text-stone-900">{t('seoSettings')}</h1>
        <p className="mt-1 text-stone-600">
          {t('seoSettingsDescription')}
        </p>
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
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Default Meta Tags */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('defaultMetaTags')}</h2>
          <p className="text-sm text-stone-500 mb-6">
            {t('defaultMetaTagsDescription')}
          </p>
          <div className="space-y-6">
            <Input
              label={t('defaultTitle')}
              placeholder={t('seoDefaultTitlePlaceholder')}
              helperText={`${(seoTitle || '').length}/60 ${t('charactersRecommended')}`}
              {...register('seoTitle')}
            />
            <Textarea
              label={t('defaultDescription')}
              placeholder={t('seoDefaultDescriptionPlaceholder')}
              rows={3}
              helperText={`${(seoDescription || '').length}/160 ${t('charactersRecommended')}`}
              {...register('seoDescription')}
            />
            <Textarea
              label={t('keywords')}
              placeholder={t('seoKeywordsPlaceholder')}
              rows={2}
              helperText={t('keywordsHint')}
              {...register('seoKeywords')}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('searchPreview')}</h2>
          <div className="p-4 bg-stone-50 rounded">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={16} className="text-stone-400" />
              <span className="text-xs text-stone-500">archcodeengineer.com</span>
            </div>
            <h3 className="text-lg text-blue-700 hover:underline cursor-pointer">
              {seoTitle || 'Arch Code Engineer | Premium Architectural Design Studio'}
            </h3>
            <p className="text-sm text-stone-600 mt-1 line-clamp-2">
              {seoDescription || 'Award-winning architectural design studio specializing in innovative residential, commercial, and urban planning solutions.'}
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 p-6 border border-blue-200">
          <h2 className="text-lg font-medium text-blue-900 mb-4 flex items-center gap-2">
            <Search size={20} />
            {t('seoTips')}
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• {t('seoTip1')}</li>
            <li>• {t('seoTip2')}</li>
            <li>• {t('seoTip3')}</li>
            <li>• {t('seoTip4')}</li>
            <li>• {t('seoTip5')}</li>
          </ul>
        </div>

        <Button type="submit" isLoading={isSaving} leftIcon={<Save size={18} />}>
          {t('saveSeoSettings')}
        </Button>
      </form>
    </div>
  );
}

