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

const homeSchema = z.object({
  heroTitle: z.string().min(1, 'Hero title is required'),
  heroTitleAr: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroSubtitleAr: z.string().optional(),
  heroImage: z.string().optional(),
  introTitle: z.string().optional(),
  introTitleAr: z.string().optional(),
  introText: z.string().optional(),
  introTextAr: z.string().optional(),
  introImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoTitleAr: z.string().optional(),
  seoDescription: z.string().optional(),
  seoDescriptionAr: z.string().optional(),
});

type HomeFormData = z.infer<typeof homeSchema>;

export default function HomeContentPage() {
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
  } = useForm<HomeFormData>({
    resolver: zodResolver(homeSchema),
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/admin/home');
        if (response.ok) {
          const data = await response.json();
          reset(data);
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [reset]);

  const onSubmit = async (data: HomeFormData) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/home', {
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
        <h1 className="text-2xl font-display text-stone-900">{t('homePageContent')}</h1>
        <p className="mt-1 text-stone-600">
          {t('homePageDescription')}
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
        {/* Hero Section */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
            <Globe size={20} />
            {t('heroSection')}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* English */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
                {t('english')}
              </div>
              <Input
                label={t('heroTitle')}
                placeholder={t('heroTitlePlaceholder')}
                error={errors.heroTitle?.message}
                {...register('heroTitle')}
              />
              <Input
                label={t('heroSubtitle')}
                placeholder={t('heroSubtitlePlaceholder')}
                {...register('heroSubtitle')}
              />
            </div>

            {/* Arabic */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
                {t('arabic')}
              </div>
              <Input
                label={t('heroTitle')}
                placeholder={t('heroTitlePlaceholderAr')}
                dir="rtl"
                {...register('heroTitleAr')}
              />
              <Input
                label={t('heroSubtitle')}
                placeholder={t('heroSubtitlePlaceholderAr')}
                dir="rtl"
                {...register('heroSubtitleAr')}
              />
            </div>
          </div>

          <Controller
            name="heroImage"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label={t('heroBackgroundImage')}
                value={field.value || ''}
                onChange={field.onChange}
                folder="home"
                aspectRatio="video"
              />
            )}
          />
        </div>

        {/* Intro Section */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
            <Globe size={20} />
            {t('introSection')}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* English */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
                {t('english')}
              </div>
              <Input
                label={t('introTitle')}
                placeholder={t('introTitlePlaceholder')}
                {...register('introTitle')}
              />
              <Textarea
                label={t('introText')}
                placeholder={t('introTextPlaceholder')}
                rows={4}
                {...register('introText')}
              />
            </div>

            {/* Arabic */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
                {t('arabic')}
              </div>
              <Input
                label={t('introTitle')}
                placeholder={t('introTitlePlaceholderAr')}
                dir="rtl"
                {...register('introTitleAr')}
              />
              <Textarea
                label={t('introText')}
                placeholder={t('introTextPlaceholderAr')}
                rows={4}
                dir="rtl"
                {...register('introTextAr')}
              />
            </div>
          </div>

          <Controller
            name="introImage"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label={t('introImage')}
                value={field.value || ''}
                onChange={field.onChange}
                folder="home"
                aspectRatio="portrait"
              />
            )}
          />
        </div>

        {/* SEO Section */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('seoSettings')}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
                {t('english')}
              </div>
              <Input
                label={t('seoTitle')}
                placeholder={t('seoTitleHomePlaceholder')}
                {...register('seoTitle')}
              />
              <Textarea
                label={t('seoDescription')}
                placeholder={t('seoDescriptionPlaceholder')}
                rows={3}
                {...register('seoDescription')}
              />
            </div>

            {/* Arabic */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
                {t('arabic')}
              </div>
              <Input
                label={t('seoTitle')}
                placeholder={t('seoTitleHomePlaceholderAr')}
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
            </div>
          </div>
        </div>

        <Button type="submit" isLoading={isSaving} leftIcon={<Save size={18} />}>
          {t('saveChanges')}
        </Button>
      </form>
    </div>
  );
}
