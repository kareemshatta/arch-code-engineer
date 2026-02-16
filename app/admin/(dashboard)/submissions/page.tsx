'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  MailOpen,
  Trash2,
  Check,
  X,
  AlertCircle,
  Clock,
  Phone,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function SubmissionsPage() {
  const t = useTranslations('admin');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchSubmissions = useCallback(async (page = 1) => {
    try {
      const unreadParam = filter === 'unread' ? '&unread=true' : '';
      const response = await fetch(`/api/admin/submissions?page=${page}&limit=20${unreadParam}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      await fetch(`/api/admin/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead }),
      });
      fetchSubmissions(pagination?.page || 1);
    } catch (error) {
      console.error('Failed to update submission:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDeleteSubmission'))) return;

    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t('submissionDeleted') });
        setSelectedId(null);
        fetchSubmissions(pagination?.page || 1);
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('failedToDeleteSubmission') });
    }
  };

  const selectedSubmission = submissions.find((s) => s.id === selectedId);

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
          <h1 className="text-2xl font-display text-stone-900">{t('contactSubmissions')}</h1>
          <p className="mt-1 text-stone-600">
            {t('submissionsDescription')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('all')}
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'unread'
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('unread')}
          </button>
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
          <button onClick={() => setMessage(null)} className="ml-auto">
            <X size={16} />
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions list */}
        <div className="lg:col-span-1 space-y-2">
          {submissions.map((submission) => (
            <button
              key={submission.id}
              onClick={() => {
                setSelectedId(submission.id);
                if (!submission.isRead) {
                  handleMarkRead(submission.id, true);
                }
              }}
              className={`w-full text-left p-4 transition-colors ${
                selectedId === submission.id
                  ? 'bg-stone-900 text-white'
                  : submission.isRead
                  ? 'bg-white hover:bg-stone-50'
                  : 'bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!submission.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                    <span className={`font-medium truncate ${
                      selectedId === submission.id ? 'text-white' : 'text-stone-900'
                    }`}>
                      {submission.name}
                    </span>
                  </div>
                  <p className={`text-sm truncate mt-1 ${
                    selectedId === submission.id ? 'text-stone-300' : 'text-stone-500'
                  }`}>
                    {submission.subject || t('noSubject')}
                  </p>
                </div>
                <span className={`text-xs whitespace-nowrap ${
                  selectedId === submission.id ? 'text-stone-400' : 'text-stone-400'
                }`}>
                  {formatDate(submission.createdAt)}
                </span>
              </div>
            </button>
          ))}

          {submissions.length === 0 && (
            <div className="text-center py-12 text-stone-500 bg-white">
              {t('noSubmissionsFound')}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white mt-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => fetchSubmissions(pagination.page - 1)}
              >
                {t('previous')}
              </Button>
              <span className="text-sm text-stone-500">
                {t('pageOf', { page: pagination.page, total: pagination.totalPages })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchSubmissions(pagination.page + 1)}
              >
                {t('next')}
              </Button>
            </div>
          )}
        </div>

        {/* Selected submission detail */}
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <div className="bg-white shadow-sm">
              {/* Header */}
              <div className="p-6 border-b border-stone-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-medium text-stone-900">
                      {selectedSubmission.subject || t('noSubject')}
                    </h2>
                    <div className="mt-2 flex items-center gap-4 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {selectedSubmission.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(selectedSubmission.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkRead(selectedSubmission.id, !selectedSubmission.isRead)}
                      className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                      title={selectedSubmission.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      {selectedSubmission.isRead ? <MailOpen size={18} /> : <Mail size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(selectedSubmission.id)}
                      className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="p-6 border-b border-stone-200 bg-stone-50">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <span className="text-stone-500">{t('email')}:</span>
                    <a
                      href={`mailto:${selectedSubmission.email}`}
                      className="ms-2 text-stone-900 hover:underline"
                    >
                      {selectedSubmission.email}
                    </a>
                  </div>
                  {selectedSubmission.phone && (
                    <div>
                      <span className="text-stone-500">{t('phone')}:</span>
                      <a
                        href={`tel:${selectedSubmission.phone}`}
                        className="ms-2 text-stone-900 hover:underline"
                      >
                        {selectedSubmission.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="p-6">
                <p className="whitespace-pre-wrap text-stone-700 leading-relaxed">
                  {selectedSubmission.message}
                </p>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-stone-200 bg-stone-50">
                <a
                  href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject || t('yourInquiry')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                  <Mail size={16} />
                  {t('replyViaEmail')}
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm p-12 text-center text-stone-500">
              <Mail size={48} className="mx-auto mb-4 opacity-30" />
              <p>{t('selectSubmission')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

