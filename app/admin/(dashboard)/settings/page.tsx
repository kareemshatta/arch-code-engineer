'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Save, Check, AlertCircle, Globe } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';

const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteNameAr: z.string().optional(),
  slogan: z.string().optional(),
  sloganAr: z.string().optional(),
  logo: z.string().optional(),
  logoDark: z.string().optional(),
  favicon: z.string().optional(),
  seoTitle: z.string().optional(),
  seoTitleAr: z.string().optional(),
  seoDescription: z.string().optional(),
  seoDescriptionAr: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoKeywordsAr: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SiteSettingsPage() {
  const t = useTranslations('admin');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          reset(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsFormData) => {
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
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-display text-stone-900">{t('siteSettings')}</h1>
        <p className="mt-1 text-stone-600">
          {t('siteSettingsDescription')}
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
        {/* Brand Info */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
            <Globe size={20} />
            {t('brandInformation')}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
                {t('english')}
              </div>
              <Input
                label={t('siteName')}
                placeholder={t('siteNamePlaceholder')}
                error={errors.siteName?.message}
                {...register('siteName')}
              />
              <Input
                label={t('slogan')}
                placeholder={t('sloganPlaceholder')}
                {...register('slogan')}
              />
            </div>

            {/* Arabic */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
                {t('arabic')}
              </div>
              <Input
                label={t('siteName')}
                placeholder={t('siteNamePlaceholderAr')}
                dir="rtl"
                {...register('siteNameAr')}
              />
              <Input
                label={t('slogan')}
                placeholder={t('sloganPlaceholderAr')}
                dir="rtl"
                {...register('sloganAr')}
              />
            </div>
          </div>
        </div>

        {/* Logo & Favicon */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('logoAndFavicon')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Controller
              name="logo"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  label={t('siteLogoLight')}
                  value={field.value || ''}
                  onChange={field.onChange}
                  folder="brand"
                  aspectRatio="landscape"
                />
              )}
            />
            <Controller
              name="logoDark"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  label={t('siteLogoDark')}
                  value={field.value || ''}
                  onChange={field.onChange}
                  folder="brand"
                  aspectRatio="landscape"
                />
              )}
            />
            <Controller
              name="favicon"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  label={t('favicon')}
                  value={field.value || ''}
                  onChange={field.onChange}
                  folder="brand"
                  aspectRatio="square"
                />
              )}
            />
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('seoSettings')}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English SEO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
                {t('english')}
              </div>
              <Input
                label={t('seoTitle')}
                placeholder={t('seoTitlePlaceholder')}
                {...register('seoTitle')}
              />
              <Textarea
                label={t('seoDescription')}
                placeholder={t('seoDescriptionPlaceholder')}
                rows={3}
                {...register('seoDescription')}
              />
              <Input
                label={t('seoKeywords')}
                placeholder={t('seoKeywordsPlaceholder')}
                {...register('seoKeywords')}
              />
            </div>

            {/* Arabic SEO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
                {t('arabic')}
              </div>
              <Input
                label={t('seoTitle')}
                placeholder={t('seoTitlePlaceholderAr')}
                dir="rtl"
                {...register('seoTitleAr')}
              />
              <Textarea
                label={t('seoDescription')}
                placeholder={t('seoDescriptionPlaceholderAr')}
                rows={3}
                dir="rtl"
                {...register('seoDescriptionAr')}
              />
              <Input
                label={t('seoKeywords')}
                placeholder={t('seoKeywordsPlaceholderAr')}
                dir="rtl"
                {...register('seoKeywordsAr')}
              />
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('analyticsAndTracking')}</h2>
          <Input
            label={t('googleAnalyticsId')}
            placeholder={t('googleAnalyticsIdPlaceholder')}
            {...register('googleAnalyticsId')}
          />
        </div>

        <Button type="submit" isLoading={isSaving} leftIcon={<Save size={18} />}>
          {t('saveChanges')}
        </Button>
      </form>
    </div>
  );
}
