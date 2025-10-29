
'use client';

import type { User } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { UploadForm } from '@/components/admin/upload-form';
import { ManageApps } from '@/components/admin/manage-apps';
import { ManageWebsites } from '@/components/admin/manage-websites';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type AdminDashboardProps = {
  user: User;
};

export function AdminDashboard({ user }: AdminDashboardProps) {
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred while logging out.',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-muted/40">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="sr-only">Admin Dashboard</span>
          </Link>
          <span className="font-bold text-foreground">Admin Dashboard</span>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <p className="ml-auto text-sm text-muted-foreground hidden sm:block">
                Logged in as <span className="font-semibold text-foreground">{user.email}</span>
            </p>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="apps">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="apps">Manage Apps</TabsTrigger>
            <TabsTrigger value="websites">Manage Websites</TabsTrigger>
          </TabsList>
          <TabsContent value="apps">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 mt-4">
              <UploadForm />
              <ManageApps />
            </div>
          </TabsContent>
          <TabsContent value="websites">
            <ManageWebsites />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
