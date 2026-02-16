'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      reset();

      // Reset to idle after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(t('formError'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label={t('formName')}
          placeholder={t('formNamePlaceholder')}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label={t('formEmail')}
          type="email"
          placeholder={t('formEmailPlaceholder')}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label={t('formPhone')}
          type="tel"
          placeholder="+1 (555) 123-4567"
          dir="ltr"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label={t('formSubject')}
          placeholder={t('formSubjectPlaceholder')}
          error={errors.subject?.message}
          {...register('subject')}
        />
      </div>

      <Textarea
        label={t('formMessage')}
        placeholder={t('formMessagePlaceholder')}
        rows={6}
        error={errors.message?.message}
        {...register('message')}
      />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Button
          type="submit"
          size="lg"
          isLoading={status === 'submitting'}
          rightIcon={<Send size={18} className="rtl-flip" />}
        >
          {t('formSubmit')}
        </Button>

        {/* Status messages */}
        <AnimatePresence mode="wait">
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2 text-green-600"
            >
              <Check size={20} />
              <span>{t('formSuccess')}</span>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2 text-red-600"
            >
              <AlertCircle size={20} />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

export default ContactForm;

