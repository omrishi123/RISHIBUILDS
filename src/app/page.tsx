
'use client';
import { SiteHeader } from '@/components/site-header';
import { AppGrid } from '@/components/app-grid';
import { WebsiteList } from '@/components/website-list';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-center">
            Welcome to App Central
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-center max-w-3xl mx-auto">
            Your one-stop hub for the latest application builds and recommended websites.
          </p>
        </div>

        <section id="applications" className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
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
          <AppGrid searchTerm={searchTerm} />
        </section>

        <Separator className="my-12 md:my-16" />

        <section id="websites">
          <h2 className="text-3xl font-bold tracking-tight mb-6">My Links</h2>
          <WebsiteList />
        </section>

      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          App Central © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
