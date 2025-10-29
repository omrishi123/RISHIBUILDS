
import type { AppArtifact as AppType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Image as ImageIcon } from 'lucide-react';

type AppCardProps = {
  app: AppType;
};

export function AppCard({ app }: AppCardProps) {
  const formattedDate = app.createdAt ? format(new Date(app.createdAt.seconds * 1000), 'PPP') : 'N/A';

  return (
    <Link href={`/apps/${app.id}`} className="block h-full group">
        <Card className="flex flex-col h-full transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
            <CardHeader>
                <div className="relative aspect-square w-full mb-4">
                    {app.logoBase64 ? (
                        <Image src={app.logoBase64} alt={`${app.name} logo`} fill className="rounded-lg object-contain" />
                    ) : (
                        <div className="w-full h-full rounded-lg bg-secondary flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <CardTitle className="text-lg font-bold truncate">{app.name}</CardTitle>
                <CardDescription>Published on {formattedDate}</CardDescription>
            </CardHeader>
        </Card>
    </Link>
  );
}
