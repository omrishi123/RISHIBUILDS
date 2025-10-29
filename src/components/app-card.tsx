import type { AppArtifact as AppType } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

type AppCardProps = {
  app: AppType;
};

export function AppCard({ app }: AppCardProps) {
  const formattedDate = app.createdAt ? format(app.createdAt.toDate(), 'PPP') : 'N/A';

  return (
    <Card className="flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="flex-row gap-4 items-start">
        {app.logoBase64 ? (
            <Image src={app.logoBase64} alt={`${app.name} logo`} width={64} height={64} className="rounded-lg object-contain" />
        ) : (
            <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-secondary flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
        )}
        <div className="flex-grow">
            <CardTitle className="text-2xl font-bold">{app.name}</CardTitle>
            <CardDescription>Uploaded on {formattedDate}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{app.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent hover:bg-accent/90">
          <a href={app.downloadUrl} download>
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
