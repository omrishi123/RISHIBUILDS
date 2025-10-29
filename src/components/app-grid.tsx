'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { App as AppType } from '@/types';
import { AppCard } from '@/components/app-card';
import { Loader2 } from 'lucide-react';

export function AppGrid() {
  const [apps, setApps] = useState<AppType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'apps'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const appsData: AppType[] = [];
        querySnapshot.forEach((doc) => {
          appsData.push({ id: doc.id, ...doc.data() } as AppType);
        });
        setApps(appsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching apps:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading apps...</p>
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="text-center py-16 bg-card border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">No apps found.</h3>
        <p className="text-muted-foreground">Please check back later or contact the administrator.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
