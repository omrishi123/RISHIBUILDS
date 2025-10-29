import type { AppArtifact as AppType } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

type AppCardProps = {
  app: AppType;
};

export function AppCard({ app }: AppCardProps) {
  const formattedDate = app.createdAt ? format(app.createdAt.toDate(), 'PPP') : 'N/A';

  return (
    <Card className="flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{app.name}</CardTitle>
        <CardDescription>Uploaded on {formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{app.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent hover:bg-accent/90">
          <a href={app.downloadURL} download>
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
