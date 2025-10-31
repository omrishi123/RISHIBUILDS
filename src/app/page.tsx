
'use client';
import { SiteHeader } from '@/components/site-header';
import { AppGrid } from '@/components/app-grid';
import { WebsiteList } from '@/components/website-list';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteFooter } from '@/components/site-footer';
import { AdBanner } from '@/components/ad-banner';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const homePageAdCode = `
    <div id="frame" style="width: 100%;margin: auto;position: relative; z-index: 99998;">
      <iframe data-aa='2415571' src='//acceptable.a-ads.com/2415571/?size=Adaptive'
                        style='border:0; padding:0; width:70%; height:auto; overflow:hidden;display: block;margin: auto'></iframe>
    </div>
  `;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-center">
            Welcome to RishiBuilds
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-center max-w-3xl mx-auto">
            Your one-stop hub for the latest application and websites build my Om Rishi Kumar
          </p>
        </div>

        {/* --- Ad Banner Added Here --- */}
        <AdBanner adCode={homePageAdCode} />

        <Tabs defaultValue="applications" className="w-full">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-sm">
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="websites">My Links</TabsTrigger>
            </TabsList>
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search for apps..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
          
          <TabsContent value="applications">
            <AppGrid searchTerm={searchTerm} />
          </TabsContent>
          <TabsContent value="websites">
            <WebsiteList />
          </TabsContent>
        </Tabs>

      </main>
      <SiteFooter />
    </div>
  );
}
