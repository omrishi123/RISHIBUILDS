
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { AppArtifact as AppType } from '@/types';
import { AppCard } from '@/components/app-card';
import { Loader2 } from 'lucide-react';

type AppGridProps = {
  searchTerm: string;
};

export function AppGrid({ searchTerm }: AppGridProps) {
  const firestore = useFirestore();
  
  const appsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'appArtifacts'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: apps, isLoading: loading, error } = useCollection<AppType>(appsQuery);

  const filteredApps = useMemo(() => {
    if (!apps) return [];
    return apps.filter(app => 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [apps, searchTerm]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading apps...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-card border rounded-lg">
        <h3 className="text-xl font-semibold mb-2 text-destructive">Error loading apps.</h3>
        <p className="text-muted-foreground">Could not fetch app list. Please try again later.</p>
      </div>
    )
  }

  if (!filteredApps || filteredApps.length === 0) {
    return (
      <div className="text-center py-16 bg-card border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">No apps found.</h3>
        <p className="text-muted-foreground">{searchTerm ? `No apps match "${searchTerm}".` : 'Please check back later or contact the administrator.'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredApps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
