import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getLocale } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  const isRTL = locale === 'ar';

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <SessionProvider>
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-stone-100">
        <AdminSidebar />
        <div className="lg:ps-64">
          <AdminHeader user={session.user} />
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
