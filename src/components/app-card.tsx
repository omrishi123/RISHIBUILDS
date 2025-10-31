
import type { AppArtifact as AppType } from '@/types';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Image as ImageIcon, Pin } from 'lucide-react';

type AppCardProps = {
  app: AppType;
};

export function AppCard({ app }: AppCardProps) {
  return (
    <Link href={`/apps/${app.id}`} className="block h-full group">
        <Card className="h-full transform transition-all duration-200 group-hover:bg-secondary/60 group-hover:shadow-md relative overflow-hidden">
            {app.isPinned && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-1 rounded-bl-lg z-10">
                <Pin className="h-4 w-4" />
              </div>
            )}
            <div className="flex items-center p-3 gap-3">
                <div className="relative h-16 w-16 flex-shrink-0">
                    {app.logoBase64 ? (
                        <Image src={app.logoBase64} alt={`${app.name} logo`} fill className="rounded-lg object-contain" />
                    ) : (
                        <div className="w-full h-full rounded-lg bg-secondary flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{app.name}</p>
                    <p className="text-xs text-muted-foreground">Version {app.version}</p>
                </div>
            </div>
        </Card>
    </Link>
  );
}
