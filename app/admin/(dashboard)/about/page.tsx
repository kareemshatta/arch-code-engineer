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

const aboutSchema = z.object({
  philosophyTitle: z.string().optional(),
  philosophyTitleAr: z.string().optional(),
  philosophyText: z.string().optional(),
  philosophyTextAr: z.string().optional(),
  philosophyImage: z.string().optional(),
  visionTitle: z.string().optional(),
  visionTitleAr: z.string().optional(),
  visionText: z.string().optional(),
  visionTextAr: z.string().optional(),
  missionTitle: z.string().optional(),
  missionTitleAr: z.string().optional(),
  missionText: z.string().optional(),
  missionTextAr: z.string().optional(),
  teamImage: z.string().optional(),
  teamDescription: z.string().optional(),
  teamDescriptionAr: z.string().optional(),
  seoTitle: z.string().optional(),
  seoTitleAr: z.string().optional(),
  seoDescription: z.string().optional(),
  seoDescriptionAr: z.string().optional(),
});

type AboutFormData = z.infer<typeof aboutSchema>;

export default function AboutContentPage() {
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
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/admin/about');
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

  const onSubmit = async (data: AboutFormData) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/about', {
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
        <h1 className="text-2xl font-display text-stone-900">{t('aboutPageContent')}</h1>
        <p className="mt-1 text-stone-600">
          {t('aboutPageDescription')}
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
        {/* Philosophy Section */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
            <Globe size={20} />
            {t('philosophySection')}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* English */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
                {t('english')}
              </div>
              <Input
                label={t('philosophyTitle')}
                placeholder={t('philosophyTitlePlaceholder')}
                {...register('philosophyTitle')}
              />
              <Textarea
                label={t('philosophyText')}
                placeholder={t('philosophyTextPlaceholder')}
                rows={5}
                {...register('philosophyText')}
              />
            </div>

            {/* Arabic */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
                {t('arabic')}
              </div>
              <Input
                label={t('philosophyTitle')}
                placeholder={t('philosophyTitlePlaceholderAr')}
                dir="rtl"
                {...register('philosophyTitleAr')}
              />
              <Textarea
                label={t('philosophyText')}
                placeholder={t('philosophyTextPlaceholderAr')}
                rows={5}
                dir="rtl"
                {...register('philosophyTextAr')}
              />
            </div>
          </div>

          <Controller
            name="philosophyImage"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label={t('philosophyImage')}
                value={field.value || ''}
                onChange={field.onChange}
                folder="about"
                aspectRatio="portrait"
              />
            )}
          />
        </div>

        {/* Vision Section */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
            <Globe size={20} />
            {t('visionSection')}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
                {t('english')}
              </div>
              <Input
                label={t('visionTitle')}
                placeholder={t('visionTitlePlaceholder')}
                {...register('visionTitle')}
              />
              <Textarea
                label={t('visionText')}
                placeholder={t('visionTextPlaceholder')}
                rows={4}
                {...register('visionText')}
              />
            </div>

            {/* Arabic */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
                {t('arabic')}
              </div>
              <Input
                label={t('visionTitle')}
                placeholder={t('visionTitlePlaceholderAr')}
                dir="rtl"
                {...register('visionTitleAr')}
              />
              <Textarea
                label={t('visionText')}
                placeholder={t('visionTextPlaceholderAr')}
                rows={4}
                dir="rtl"
                {...register('visionTextAr')}
              />
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
            <Globe size={20} />
            {t('missionSection')}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
                {t('english')}
              </div>
              <Input
                label={t('missionTitle')}
                placeholder={t('missionTitlePlaceholder')}
                {...register('missionTitle')}
              />
              <Textarea
                label={t('missionText')}
                placeholder={t('missionTextPlaceholder')}
                rows={4}
                {...register('missionText')}
              />
            </div>

            {/* Arabic */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
                {t('arabic')}
              </div>
              <Input
                label={t('missionTitle')}
                placeholder={t('missionTitlePlaceholderAr')}
                dir="rtl"
                {...register('missionTitleAr')}
              />
              <Textarea
                label={t('missionText')}
                placeholder={t('missionTextPlaceholderAr')}
                rows={4}
                dir="rtl"
                {...register('missionTextAr')}
              />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('teamSection')}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Textarea
              label={`${t('teamDescription')} (${t('english')})`}
              placeholder={t('teamDescriptionPlaceholder')}
              rows={3}
              {...register('teamDescription')}
            />
            <Textarea
              label={`${t('teamDescription')} (${t('arabic')})`}
              placeholder={t('teamDescriptionPlaceholderAr')}
              rows={3}
              dir="rtl"
              {...register('teamDescriptionAr')}
            />
          </div>

          <Controller
            name="teamImage"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label={t('teamPhoto')}
                value={field.value || ''}
                onChange={field.onChange}
                folder="about"
                aspectRatio="landscape"
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
                placeholder={t('seoTitleAboutPlaceholder')}
                {...register('seoTitle')}
              />
              <Textarea
                label={t('seoDescription')}
                placeholder={t('seoDescriptionAboutPlaceholder')}
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
                placeholder={t('seoTitleAboutPlaceholderAr')}
                dir="rtl"
                {...register('seoTitleAr')}
              />
              <Textarea
                label={t('seoDescription')}
                placeholder={t('seoDescriptionAboutPlaceholderAr')}
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
