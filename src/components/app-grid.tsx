
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

  const filteredAndSortedApps = useMemo(() => {
    if (!apps) return [];
    
    // Filter first
    const filtered = apps.filter(app => 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then sort: pinned apps first, then by creation date
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // If both are pinned or both are not, original order (by date) is maintained
      // because the initial query is already sorted by createdAt.
      return 0;
    });

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

  if (!filteredAndSortedApps || filteredAndSortedApps.length === 0) {
    return (
      <div className="text-center py-16 bg-card border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">No apps found.</h3>
        <p className="text-muted-foreground">{searchTerm ? `No apps match "${searchTerm}".` : 'Please check back later or contact the administrator.'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredAndSortedApps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
