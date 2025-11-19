'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardPanel } from '@/components/admin/DashboardPanel';
import { AdminManagement } from '@/components/admin/AdminManagement';
import { UserManagement } from '@/components/admin/UserManagement';
import { FeedbackManagement } from '@/components/admin/FeedbackManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Shield, Users, MessageSquare } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/components/language-provider';

export default function AdminPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 检查管理员权限
    const checkAdminAuth = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      if (!token || userRole !== 'admin') {
        // 未授权，重定向到登录页
        router.push('/sign-in');
        return;
      }

      setIsAuthorized(true);
    };

    checkAdminAuth();
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{t('common.loading')}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('admin.dashboard')}</h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                router.push('/sign-in');
              }}
              className="rounded-md bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('admin.dashboard')}
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t('admin.admins')}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('admin.users')}
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t('admin.feedbacks')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <DashboardPanel />
          </TabsContent>

          <TabsContent value="admins" className="mt-6">
            <AdminManagement />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="feedback" className="mt-6">
            <FeedbackManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
