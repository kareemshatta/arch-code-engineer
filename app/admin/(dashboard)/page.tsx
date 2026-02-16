import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import {
  FolderOpen,
  FileText,
  Mail,
  Eye,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';

async function getDashboardStats() {
  const [projectCount, serviceCount, submissionCount, unreadCount] =
    await Promise.all([
      prisma.project.count({ where: { isActive: true } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { isRead: false } }),
    ]);

  return { projectCount, serviceCount, submissionCount, unreadCount };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const t = await getTranslations('admin');

  const statCards = [
    {
      label: t('unreadMessages'),
      value: stats.unreadCount,
      icon: FileText,
      href: '/admin/submissions',
      color: 'bg-orange-500',
    },
    {
      label: t('contactSubmissions'),
      value: stats.submissionCount,
      icon: Mail,
      href: '/admin/submissions',
      color: 'bg-purple-500',
    },
    {
      label: t('services'),
      value: stats.serviceCount,
      icon: Wrench,
      href: '/admin/services',
      color: 'bg-green-500',
    },
    {
      label: t('activeProjects'),
      value: stats.projectCount,
      icon: FolderOpen,
      href: '/admin/projects',
      color: 'bg-blue-500',
    },
  ];

  const quickLinks = [
    { label: t('viewWebsite'), href: '/', icon: Eye, external: true },
    { label: t('addProject'), href: '/admin/projects/new', icon: FolderOpen },
  ];

  const gettingStartedSteps = [
    {
      title: t('updateSiteSettings'),
      description: t('customizeBrandDescription'),
    },
    {
      title: t('addYourProjects'),
      description: t('showcaseWorkDescription'),
    },
    {
      title: t('configureContactInfo'),
      description: t('reachYouDescription'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-start">
        <h1 className="text-2xl font-display text-stone-900">
          {t('welcomeDashboard')}
        </h1>
        <p className="mt-1 text-stone-600">
          {t('manageSiteDescription')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="text-start">
                  <p className="text-sm text-stone-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-stone-900">
                    {stat.value}
                  </p>
                </div>
                <div className={cn('p-3 text-white rounded-lg', stat.color)}>
                  <Icon size={20} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-medium text-stone-900 mb-4 text-start">
          {t('quickActions')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                className="flex items-center gap-3 p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-2 bg-stone-100 text-stone-600">
                  <Icon size={20} />
                </div>
                <span className="font-medium text-stone-900">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Getting Started */}
      <section>
        <h2 className="text-lg font-medium text-stone-900 mb-4 text-start">
          {t('gettingStarted')}
        </h2>
        <div className="bg-white p-6 shadow-sm">
          <ul className="space-y-4">
            {gettingStartedSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stone-900 text-white text-xs flex items-center justify-center rounded-full flex-shrink-0">
                  {index + 1}
                </div>
                <div className="text-start">
                  <p className="font-medium text-stone-900">{step.title}</p>
                  <p className="text-sm text-stone-500">{step.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
