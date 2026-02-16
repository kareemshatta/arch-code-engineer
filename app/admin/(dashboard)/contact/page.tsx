'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Save, Check, AlertCircle, ExternalLink, Globe } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const contactSchema = z.object({
  address: z.string().optional(),
  addressAr: z.string().optional(),
  city: z.string().optional(),
  cityAr: z.string().optional(),
  country: z.string().optional(),
  countryAr: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  email2: z.string().email().optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  officeHours: z.string().optional(),
  officeHoursAr: z.string().optional(),
  mapLink: z.string().url().optional().or(z.literal('')),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactInfoPage() {
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
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const mapLink = watch('mapLink');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch('/api/admin/contact');
        if (response.ok) {
          const data = await response.json();
          reset(data);
        }
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, [reset]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/contact', {
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
        <h1 className="text-2xl font-display text-stone-900">{t('contactInformation')}</h1>
        <p className="mt-1 text-stone-600">
          {t('contactInfoDescription')}
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
        {/* Address */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
            <Globe size={20} />
            {t('officeAddress')}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
                {t('english')}
              </div>
              <Input
                label={t('streetAddress')}
                placeholder={t('streetAddressPlaceholder')}
                {...register('address')}
              />
              <Input
                label={t('city')}
                placeholder={t('cityPlaceholder')}
                {...register('city')}
              />
              <Input
                label={t('country')}
                placeholder={t('countryPlaceholder')}
                {...register('country')}
              />
            </div>

            {/* Arabic */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
                {t('arabic')}
              </div>
              <Input
                label={t('streetAddress')}
                placeholder={t('streetAddressPlaceholderAr')}
                dir="rtl"
                {...register('addressAr')}
              />
              <Input
                label={t('city')}
                placeholder={t('cityPlaceholderAr')}
                dir="rtl"
                {...register('cityAr')}
              />
              <Input
                label={t('country')}
                placeholder={t('countryPlaceholderAr')}
                dir="rtl"
                {...register('countryAr')}
              />
            </div>
          </div>

          <div className="mt-6">
            <Input
              label={t('postalCode')}
              placeholder={t('postalCodePlaceholder')}
              {...register('postalCode')}
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('contactDetails')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t('primaryPhone')}
              placeholder={t('phonePlaceholder')}
              {...register('phone')}
            />
            <Input
              label={t('secondaryPhone')}
              placeholder={t('phonePlaceholder')}
              {...register('phone2')}
            />
            <Input
              label={t('primaryEmail')}
              type="email"
              placeholder={t('emailPlaceholder')}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label={t('secondaryEmail')}
              type="email"
              placeholder={t('emailPlaceholder')}
              error={errors.email2?.message}
              {...register('email2')}
            />
            <Input
              label={t('whatsappNumber')}
              placeholder={t('whatsappPlaceholder')}
              {...register('whatsapp')}
            />
          </div>
        </div>

        {/* Office Hours */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
            <Globe size={20} />
            {t('officeHours')}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label={`${t('officeHours')} (${t('english')})`}
              placeholder={t('officeHoursPlaceholder')}
              {...register('officeHours')}
            />
            <Input
              label={`${t('officeHours')} (${t('arabic')})`}
              placeholder={t('officeHoursPlaceholderAr')}
              dir="rtl"
              {...register('officeHoursAr')}
            />
          </div>
        </div>

        {/* Google Maps Link */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('googleMapsLocation')}</h2>
          <Input
            label={t('googleMapsLink')}
            placeholder={t('googleMapsLinkPlaceholder')}
            error={errors.mapLink?.message}
            {...register('mapLink')}
          />
          <p className="mt-2 text-sm text-stone-500">
            {t('googleMapsHint')}
          </p>
          {mapLink && (
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
            >
              <ExternalLink size={16} />
              {t('previewLink')}
            </a>
          )}
        </div>

        <Button type="submit" isLoading={isSaving} leftIcon={<Save size={18} />}>
          {t('saveChanges')}
        </Button>
      </form>
    </div>
  );
}
