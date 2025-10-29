
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Website as WebsiteType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

type WebsiteCardProps = {
  site: WebsiteType;
};

export function WebsiteCard({ site }: WebsiteCardProps) {
  const [hasError, setHasError] = useState(false);

  const getFaviconUrl = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return `https://s2.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch (e) {
      // Invalid URL, fallback will be used
      return '';
    }
  };

  const faviconUrl = getFaviconUrl(site.url);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex-row gap-4 items-center">
        <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
          {!hasError && faviconUrl ? (
            <Image
              src={faviconUrl}
              alt={`${site.name} favicon`}
              width={48}
              height={48}
              className="rounded-lg"
              onError={() => setHasError(true)}
            />
          ) : (
            <Globe className="h-6 w-6 text-primary" />
          )}
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
  );
}
