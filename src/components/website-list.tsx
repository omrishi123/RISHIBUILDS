
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Website as WebsiteType } from '@/types';
import { Loader2 } from 'lucide-react';
import { WebsiteCard } from '@/components/website-card';

export function WebsiteList() {
  const firestore = useFirestore();
  
  const websitesQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'websites'), orderBy('name', 'asc'));
  }, [firestore]);

  const { data: websites, isLoading: loading, error } = useCollection<WebsiteType>(websitesQuery);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-card border rounded-lg">
        <h3 className="text-xl font-semibold mb-2 text-destructive">Error loading websites.</h3>
        <p className="text-muted-foreground">Could not fetch website list. Please try again later.</p>
      </div>
    )
  }

  if (!websites || websites.length === 0) {
    return (
       <div className="text-center py-16 bg-card border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">No websites found.</h3>
        <p className="text-muted-foreground">The administrator has not added any websites yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((site) => (
            <WebsiteCard key={site.id} site={site} />
        ))}
    </div>
  );
}
