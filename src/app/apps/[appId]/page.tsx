

'use client';

import { useMemo } from 'react';
import { doc, increment } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import type { AppArtifact as AppType } from '@/types';
import { SiteHeader } from '@/components/site-header';
import { Loader2, Download, Package, Info, MessageSquare, BarChart2, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';

type AppDetailPageProps = {
  params: { appId: string };
};

export default function AppDetailPage({ params }: AppDetailPageProps) {
  const { appId } = params;
  const firestore = useFirestore();

  const appRef = useMemoFirebase(() => {
    if (!firestore || !appId) return null;
    return doc(firestore, 'appArtifacts', appId);
  }, [firestore, appId]);

  const { data: app, isLoading, error } = useDoc<AppType>(appRef);

  const handleDownloadClick = () => {
    if (!appRef) return;
    // Increment the download count in Firestore
    updateDocumentNonBlocking(appRef, {
        downloadCount: increment(1)
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center text-center">
            <div>
                <h2 className="text-2xl font-bold text-destructive">App not found</h2>
                <p className="text-muted-foreground">The requested app could not be loaded. It may have been removed.</p>
                <Button asChild variant="outline" className="mt-4">
                    <a href="/">Return Home</a>
                </Button>
            </div>
        </div>
      </div>
    );
  }

  const formattedDate = app.createdAt ? format(app.createdAt.toDate(), 'PPP') : 'N/A';

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative aspect-square w-full">
                {app.logoBase64 ? (
                    <Image src={app.logoBase64} alt={`${app.name} logo`} fill className="object-contain" />
                ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <ImageIcon className="h-24 w-24 text-muted-foreground" />
                    </div>
                )}
              </div>
            </Card>
            <Button asChild className="w-full text-lg" size="lg" onClick={handleDownloadClick}>
              <a href={app.downloadUrl} download>
                <Download className="mr-3 h-5 w-5" />
                Download APK
              </a>
            </Button>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-8">
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{app.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <Badge variant="secondary">Version {app.version}</Badge>
                    <span>|</span>
                    <span>Published on {formattedDate}</span>
                </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary" /> App Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 whitespace-pre-wrap">{app.description}</p>
              </CardContent>
            </Card>
            
            <div className="grid sm:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5 text-primary" /> Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Downloads</span>
                            <span className="font-bold">{app.downloadCount || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">App Rating</span>
                            <span className="font-bold">Coming Soon</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Version</span>
                            <span className="font-bold">{app.version}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Release Date</span>
                            <span className="font-bold">{formattedDate}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">Review functionality coming soon.</p>
                </CardContent>
            </Card>

          </div>
        </div>
      </main>
      <footer className="py-6 border-t mt-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          App Central © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
