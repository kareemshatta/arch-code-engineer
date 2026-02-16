'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Star,
  StarOff,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Project {
  id: string;
  title: string;
  titleAr: string | null;
  slug: string;
  description: string;
  descriptionAr: string | null;
  thumbnail: string | null;
  category: string | null;
  categoryAr: string | null;
  location: string | null;
  year: string | null;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

export default function ProjectsPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Helper to get localized content
  const getLocalizedText = (en: string, ar: string | null) => {
    return isArabic && ar ? ar : en;
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDeleteProject'))) return;

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t('projectDeleted') });
        fetchProjects();
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('failedToDelete') });
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !project.isFeatured }),
      });
      fetchProjects();
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  const handleToggleActive = async (project: Project) => {
    try {
      await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !project.isActive }),
      });
      fetchProjects();
    } catch (error) {
      console.error('Failed to toggle active:', error);
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-stone-900">{t('projects')}</h1>
          <p className="mt-1 text-stone-600">{t('projectsPageDescription')}</p>
        </div>
        <Link href="/admin/projects/new">
          <Button leftIcon={<Plus size={18} />}>{t('addProject')}</Button>
        </Link>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            className={`bg-white shadow-sm overflow-hidden ${
              !project.isActive ? 'opacity-60' : ''
            }`}
          >
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] bg-stone-200">
              {project.thumbnail ? (
                <Image
                  src={project.thumbnail}
                  alt={getLocalizedText(project.title, project.titleAr)}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-stone-400 font-display text-4xl">
                    {getLocalizedText(project.title, project.titleAr).charAt(0)}
                  </span>
                </div>
              )}
              {/* Featured badge */}
              {project.isFeatured && (
                <div className="absolute top-2 start-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-medium">
                  {t('featured')}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-medium text-stone-900 truncate">
                    {getLocalizedText(project.title, project.titleAr)}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                    {(project.category || project.categoryAr) && (
                      <span>{getLocalizedText(project.category || '', project.categoryAr)}</span>
                    )}
                    {project.year && <span>• {project.year}</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleFeatured(project)}
                  className="p-1 text-stone-400 hover:text-yellow-500"
                  title={project.isFeatured ? 'Remove from featured' : 'Add to featured'}
                >
                  {project.isFeatured ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                </button>
              </div>

              <p className="mt-2 text-sm text-stone-600 line-clamp-2">
                {getLocalizedText(project.description, project.descriptionAr)}
              </p>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleActive(project)}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    project.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {project.isActive ? t('active') : t('draft')}
                </button>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                    title="View project"
                  >
                    <Eye size={16} />
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                    title="Edit project"
                  >
                    <Edit2 size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20 bg-white shadow-sm">
          <p className="text-stone-500 mb-4">{t('noProjectsYet')}</p>
          <Link href="/admin/projects/new">
            <Button leftIcon={<Plus size={18} />}>{t('addFirstProject')}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

