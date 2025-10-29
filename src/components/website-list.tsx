
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Website as WebsiteType } from '@/types';
import { Loader2, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        <Card key={site.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex-row gap-4 items-center">
                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <CardTitle>{site.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{site.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
            <Button asChild variant="outline">
                <a href={site.url} target="_blank" rel="noopener noreferrer">
                Visit Site
                </a>
            </Button>
            </CardContent>
        </Card>
        ))}
    </div>
  );
}
