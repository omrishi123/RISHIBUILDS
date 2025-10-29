import { SiteHeader } from '@/components/site-header';
import { AppGrid } from '@/components/app-grid';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const links = [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Documentation', url: 'https://docs.example.com' },
  { name: 'Community', url: 'https://community.example.com' },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-center">
            Welcome to App Central
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-center max-w-3xl mx-auto">
            Your one-stop hub for the latest application builds. Download and stay updated with our newest releases.
          </p>
        </div>

        <AppGrid />

        <Separator className="my-12 md:my-16" />

        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-6">My Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <Card key={link.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{link.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      Visit Site
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Card className="sm:col-span-2 lg:col-span-1 border-dashed">
                <CardHeader>
                    <CardTitle>Admin Panel</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/admin">Go to Admin</Link>
                    </Button>
                </CardContent>
            </Card>
          </div>
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
