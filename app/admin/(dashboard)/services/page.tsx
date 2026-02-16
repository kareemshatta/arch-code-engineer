'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Check,
  AlertCircle,
  GripVertical,
  Globe,
} from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Service {
  id: string;
  title: string;
  titleAr: string | null;
  description: string;
  descriptionAr: string | null;
  icon: string | null;
  image: string | null;
  slug: string | null;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
}

export default function ServicesPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Helper to get localized content
  const getLocalizedText = (en: string, ar: string | null) => {
    return isArabic && ar ? ar : en;
  };

  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    icon: '',
    image: '',
    slug: '',
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      icon: '',
      image: '',
      slug: '',
      isActive: true,
      isFeatured: false,
    });
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setIsAddingNew(false);
    setFormData({
      title: service.title,
      titleAr: service.titleAr || '',
      description: service.description,
      descriptionAr: service.descriptionAr || '',
      icon: service.icon || '',
      image: service.image || '',
      slug: service.slug || '',
      isActive: service.isActive,
      isFeatured: service.isFeatured,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setFormData({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      icon: '',
      image: '',
      slug: '',
      isActive: true,
      isFeatured: false,
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: t('titleRequired') });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const url = editingId
        ? `/api/admin/services/${editingId}`
        : '/api/admin/services';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: editingId ? t('serviceUpdated') : t('serviceAdded'),
        });
        handleCancel();
        fetchServices();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('failedToSave') });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t('serviceDeleted') });
        fetchServices();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('failedToDelete') });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full" />
      </div>
    );
  }

  const ServiceForm = () => (
    <div className="space-y-6">
      {/* Bilingual Title & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* English */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
            <span className="px-2 py-0.5 bg-stone-100 rounded">EN</span>
            {t('english')}
          </div>
          <Input
            label={t('title')}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder={t('serviceTitlePlaceholder')}
          />
          <Textarea
            label={t('description')}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={t('serviceDescriptionPlaceholder')}
            rows={4}
          />
        </div>

        {/* Arabic */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-2">
            <span className="px-2 py-0.5 bg-stone-100 rounded">AR</span>
            {t('arabic')}
          </div>
          <Input
            label={t('title')}
            value={formData.titleAr}
            onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
            placeholder={t('serviceTitlePlaceholderAr')}
            dir="rtl"
          />
          <Textarea
            label={t('description')}
            value={formData.descriptionAr}
            onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
            placeholder={t('serviceDescriptionPlaceholderAr')}
            rows={4}
            dir="rtl"
          />
        </div>
      </div>

      {/* Other fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t('serviceSlug')}
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder={t('serviceSlugPlaceholder')}
        />
        <Input
          label={t('iconLucideName')}
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder={t('iconPlaceholder')}
        />
      </div>

      <ImageUpload
        label={t('serviceImage')}
        value={formData.image}
        onChange={(url) => setFormData({ ...formData, image: url })}
        folder="services"
        aspectRatio="landscape"
      />

      <div className="flex gap-6">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-5 h-5"
          />
          <span>{t('active')}</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-5 h-5"
          />
          <span>{t('featured')}</span>
        </label>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save size={18} />}>
          {editingId ? t('save') : t('addService')}
        </Button>
        <Button variant="ghost" onClick={handleCancel}>
          {t('cancel')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-stone-900">{t('services')}</h1>
          <p className="mt-1 text-stone-600">
            {t('servicesPageDescription')}
          </p>
        </div>
        <Button onClick={handleAdd} leftIcon={<Plus size={18} />}>
          {t('addService')}
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
        </motion.div>
      )}

      {/* Add New Form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-white p-6 shadow-sm overflow-hidden"
          >
            <h2 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
              <Globe size={20} />
              {t('newService')}
            </h2>
            <ServiceForm />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white shadow-sm">
            {editingId === service.id ? (
              <div className="p-6">
                <h2 className="text-lg font-medium text-stone-900 mb-6 flex items-center gap-2">
                  <Globe size={20} />
                  {t('editService')}
                </h2>
                <ServiceForm />
              </div>
            ) : (
              <div className="p-6 flex items-center gap-4">
                <div className="text-stone-400 cursor-move">
                  <GripVertical size={20} />
                </div>
                {service.image && (
                  <div className="w-20 h-20 bg-stone-100 overflow-hidden flex-shrink-0">
                    <img
                      src={service.image}
                      alt={getLocalizedText(service.title, service.titleAr)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-stone-900">
                      {getLocalizedText(service.title, service.titleAr)}
                    </h3>
                    {!service.isActive && (
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-xs">
                        {t('draft')}
                      </span>
                    )}
                    {service.isFeatured && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs">
                        {t('featured')}
                      </span>
                    )}
                  </div>
                  <p className="text-stone-600 text-sm line-clamp-2 mt-1">
                    {getLocalizedText(service.description, service.descriptionAr)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 text-stone-400 hover:text-stone-900"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-stone-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {services.length === 0 && !isAddingNew && (
          <div className="text-center py-12 bg-white shadow-sm">
            <p className="text-stone-500">{t('noServicesYet')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
