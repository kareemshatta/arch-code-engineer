'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Save, ArrowLeft, Check, AlertCircle, Eye, Globe } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload, MultiImageUpload } from '@/components/admin/ImageUpload';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  titleAr: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  descriptionAr: z.string().optional(),
  fullDescription: z.string().optional(),
  fullDescriptionAr: z.string().optional(),
  location: z.string().optional(),
  locationAr: z.string().optional(),
  year: z.string().optional(),
  client: z.string().optional(),
  clientAr: z.string().optional(),
  area: z.string().optional(),
  category: z.string().optional(),
  categoryAr: z.string().optional(),
  thumbnail: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoTitleAr: z.string().optional(),
  seoDescription: z.string().optional(),
  seoDescriptionAr: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
}

const categories = [
  { en: 'Residential', ar: 'سكني' },
  { en: 'Commercial', ar: 'تجاري' },
  { en: 'Cultural', ar: 'ثقافي' },
  { en: 'Hospitality', ar: 'ضيافة' },
  { en: 'Education', ar: 'تعليمي' },
  { en: 'Healthcare', ar: 'صحي' },
  { en: 'Mixed-Use', ar: 'متعدد الاستخدامات' },
  { en: 'Urban Planning', ar: 'تخطيط عمراني' },
];

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const t = useTranslations('admin');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<ProjectImage[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const slug = watch('slug');
  const selectedCategory = watch('category');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/admin/projects/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          reset(data);
          setOriginalImages(data.images || []);
          setGalleryImages((data.images || []).map((img: ProjectImage) => img.url));
        } else {
          router.push('/admin/projects');
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, reset, router]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = categories.find(c => c.en === e.target.value);
    setValue('category', e.target.value);
    if (cat) {
      setValue('categoryAr', cat.ar);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update');
      }

      // Handle gallery images
      const originalUrls = originalImages.map(img => img.url);
      const newUrls = galleryImages;

      // Delete removed images
      for (const img of originalImages) {
        if (!newUrls.includes(img.url)) {
          await fetch(`/api/admin/projects/${projectId}/images`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageId: img.id }),
          });
        }
      }

      // Add new images
      for (const url of newUrls) {
        if (!originalUrls.includes(url)) {
          await fetch(`/api/admin/projects/${projectId}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
          });
        }
      }

      setMessage({ type: 'success', text: t('projectUpdated') });

      // Refresh images
      const refreshResponse = await fetch(`/api/admin/projects/${projectId}`);
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setOriginalImages(refreshData.images || []);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('failedToUpdateProject');
      setMessage({ type: 'error', text: errorMessage });
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
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-4"
        >
          <ArrowLeft size={18} className="rtl-flip" />
          <span>{t('backToProjects')}</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display text-stone-900">{t('editProject')}</h1>
            <p className="mt-1 text-stone-600">{t('editProjectDescription')}</p>
          </div>
          {slug && (
            <Link href={`/projects/${slug}`} target="_blank">
              <Button variant="ghost" leftIcon={<Eye size={18} />}>
                {t('viewLive')}
              </Button>
            </Link>
          )}
        </div>
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
        {/* Basic Info */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
            <Globe size={20} />
            {t('basicInformation')}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* English */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
                {t('english')}
              </div>
              <Input
                label={t('projectTitle')}
                error={errors.title?.message}
                {...register('title')}
              />
              <Textarea
                label={t('shortDescription')}
                rows={3}
                error={errors.description?.message}
                {...register('description')}
              />
              <Textarea
                label={t('projectFullDescription')}
                rows={5}
                {...register('fullDescription')}
              />
            </div>

            {/* Arabic */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
                {t('arabic')}
              </div>
              <Input
                label={t('projectTitle')}
                dir="rtl"
                {...register('titleAr')}
              />
              <Textarea
                label={t('shortDescription')}
                rows={3}
                dir="rtl"
                {...register('descriptionAr')}
              />
              <Textarea
                label={t('projectFullDescription')}
                rows={5}
                dir="rtl"
                {...register('fullDescriptionAr')}
              />
            </div>
          </div>

          <Input
            label={t('urlSlug')}
            error={errors.slug?.message}
            {...register('slug')}
          />
        </div>

        {/* Project Details */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
            <Globe size={20} />
            {t('projectDetails')}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
                {t('english')}
              </div>
              <div>
                <label className="block text-xs font-medium tracking-wider uppercase text-stone-500 mb-2">
                  {t('projectCategory')}
                </label>
                <select
                  className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none"
                  value={selectedCategory || ''}
                  onChange={handleCategoryChange}
                >
                  <option value="">{t('selectCategory')}</option>
                  {categories.map((cat) => (
                    <option key={cat.en} value={cat.en}>
                      {cat.en}
                    </option>
                  ))}
                </select>
              </div>
              <Input label={t('projectLocation')} {...register('location')} />
              <Input label={t('projectClient')} {...register('client')} />
            </div>

            {/* Arabic */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
                {t('arabic')}
              </div>
              <Input label={t('projectCategory')} dir="rtl" {...register('categoryAr')} />
              <Input label={t('projectLocation')} dir="rtl" {...register('locationAr')} />
              <Input label={t('projectClient')} dir="rtl" {...register('clientAr')} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Input label={t('projectYear')} {...register('year')} />
            <Input label={t('projectArea')} {...register('area')} />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('thumbnailImage')}</h2>
          <Controller
            name="thumbnail"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label={t('projectThumbnail')}
                value={field.value || ''}
                onChange={field.onChange}
                folder="projects"
                aspectRatio="landscape"
              />
            )}
          />
        </div>

        {/* Gallery */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('galleryImages')}</h2>
          <MultiImageUpload
            values={galleryImages}
            onChange={setGalleryImages}
            folder="projects"
            label={t('projectGallery')}
            maxImages={20}
          />
        </div>

        {/* Settings */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('projectSettings')}</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 border-stone-300 rounded"
                {...register('isActive')}
              />
              <span>{t('published')}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 border-stone-300 rounded"
                {...register('isFeatured')}
              />
              <span>{t('featuredOnHomepage')}</span>
            </label>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-stone-900 mb-6">{t('seoSettings')}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
                {t('english')}
              </div>
              <Input label={t('seoTitle')} {...register('seoTitle')} />
              <Textarea label={t('seoDescription')} rows={3} {...register('seoDescription')} />
            </div>

            {/* Arabic */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
                <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
                {t('arabic')}
              </div>
              <Input label={t('seoTitle')} dir="rtl" {...register('seoTitleAr')} />
              <Textarea label={t('seoDescription')} rows={3} dir="rtl" {...register('seoDescriptionAr')} />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" isLoading={isSaving} leftIcon={<Save size={18} />}>
            {t('saveChanges')}
          </Button>
          <Link href="/admin/projects">
            <Button type="button" variant="ghost">
              {t('cancel')}
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
