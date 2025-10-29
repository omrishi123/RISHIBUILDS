'use client';

import { useState, useEffect } from 'react';
import type { App as AppType } from '@/types';
import {
  collection,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Loader2, Package } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '../ui/separator';

export function ManageApps() {
  const [apps, setApps] = useState<AppType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'apps'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appsData: AppType[] = [];
      querySnapshot.forEach((doc) => {
        appsData.push({ id: doc.id, ...doc.data() } as AppType);
      });
      setApps(appsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (app: AppType) => {
    setDeletingId(app.id);
    try {
      // 1. Delete file from Storage
      const fileRef = ref(storage, app.storagePath);
      await deleteObject(fileRef);

      // 2. Delete document from Firestore
      await deleteDoc(doc(db, 'apps', app.id));

      toast({
        title: 'App Deleted',
        description: `"${app.name}" has been successfully deleted.`,
      });
    } catch (error) {
      console.error('Deletion failed:', error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: 'An error occurred while deleting the app.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Apps</CardTitle>
        <CardDescription>
          View and delete currently uploaded applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : apps.length > 0 ? (
            <ul className="space-y-4">
              {apps.map((app) => (
                <li key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="font-semibold">{app.name}</p>
                        <p className="text-xs text-muted-foreground">
                            Added on {app.createdAt ? format(app.createdAt.toDate(), 'P') : 'N/A'}
                        </p>
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={deletingId === app.id}
                      >
                        {deletingId === app.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the app
                          <span className="font-bold"> "{app.name}" </span>
                          and remove its file from storage.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(app)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full text-muted-foreground">
              <p>No apps have been uploaded yet.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
