'use client';

import { useUser } from '@/firebase';
import { AuthForm } from '@/components/auth-form';
import { AdminDashboard } from '@/components/admin/dashboard';
import { Loader2 } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4">
            <AuthForm />
        </main>
      </div>
    )
  }

  return <AdminDashboard user={user} />;
}
