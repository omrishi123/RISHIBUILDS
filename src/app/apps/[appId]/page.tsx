
'use client';

import { useMemo, use } from 'react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { AppArtifact as AppType } from '@/types';
import { SiteHeader } from '@/components/site-header';
import { Loader2, Download, Package, Info, MessageSquare, BarChart2, Image as ImageIcon, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { SiteFooter } from '@/components/site-footer';
import { AdBanner } from '@/components/ad-banner';

type AppDetailPageProps = {
  params: Promise<{ appId: string }>;
};

export default function AppDetailPage({ params }: AppDetailPageProps) {
  const { appId } = use(params);
  const firestore = useFirestore();
  const { toast } = useToast();

  const appRef = useMemoFirebase(() => {
    if (!firestore || !appId) return null;
    return doc(firestore, 'appArtifacts', appId);
  }, [firestore, appId]);

  const { data: app, isLoading } = useDoc<AppType>(appRef);

  const handleDownloadClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!appRef || !app?.downloadUrl) return;

    event.preventDefault();
    
    try {
      await updateDoc(appRef, {
          downloadCount: increment(1)
      });
    } catch (e) {
      console.error("Failed to increment download count:", e);
    }

    window.location.href = app.downloadUrl;
  };

  const handleShareClick = async () => {
    if (!app) return;
    const shareData = {
        title: app.name,
        text: `Check out ${app.name} on RishiBuilds!`,
        url: window.location.href
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(window.location.href);
            toast({
                title: 'Link Copied!',
                description: 'The app link has been copied to your clipboard.',
            });
        }
    } catch (err) {
        console.error('Share failed:', err);
        toast({
            variant: "destructive",
            title: 'Share Failed',
            description: 'Could not share the app at this time.',
        });
    }
  };

  const appPageAdCode = `
    <div id="frame" style="width: 100%;margin: auto;position: relative; z-index: 99998;">
      <iframe data-aa='2415573' src='//acceptable.a-ads.com/2415573/?size=Adaptive'
                        style='border:0; padding:0; width:70%; height:auto; overflow:hidden;display: block;margin: auto'></iframe>
    </div>
  `;

  const leftColumnAdCode = `
    <div id="frame" style="width: 100%;margin: auto;position: relative; z-index: 99998;">
          <iframe data-aa='2415574' src='//acceptable.a-ads.com/2415574/?size=Adaptive'
                            style='border:0; padding:0; width:70%; height:auto; overflow:hidden;display: block;margin: auto'></iframe>
    </div>
    `;
  
  if (!appId || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex flex-col min-h-screen">
          <SiteHeader />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
          <SiteFooter />
      </div>
    );
  }

  const formattedDate = app.createdAt ? format(new Date(app.createdAt.seconds * 1000), 'PPP') : 'N/A';

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
            <div className="flex items-center gap-2">
                <Button className="w-full text-lg" size="lg" onClick={handleDownloadClick}>
                    <Download className="mr-3 h-5 w-5" />
                    Download APK
                </Button>
                <Button variant="outline" size="lg" className="px-4" onClick={handleShareClick}>
                    <Share2 className="h-5 w-5" />
                </Button>
            </div>
            <div className="hidden md:block">
              <AdBanner adCode={leftColumnAdCode} />
            </div>
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

            <AdBanner adCode={appPageAdCode} />

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
      <SiteFooter />
    </div>
  );
}
