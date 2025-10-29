'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, CheckCircle } from 'lucide-react';

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { formatBytes } from '@/lib/utils';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

const formSchema = z.object({
  name: z.string().min(3, 'App name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'An app file is required.')
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Max file size is ${formatBytes(MAX_FILE_SIZE)}.`
    ),
});

export function UploadForm() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      file: new File([], ""),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const file = values.file;
    if (!file) return;

    setIsUploading(true);
    const storagePath = `app_files/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: error.message,
        });
        setIsUploading(false);
        setUploadProgress(0);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        await addDoc(collection(db, 'apps'), {
          name: values.name,
          description: values.description,
          downloadURL,
          storagePath,
          createdAt: serverTimestamp(),
        });
        
        toast({
          title: 'Success!',
          description: 'Your app has been uploaded successfully.',
          action: (
            <div className="p-1 rounded-full bg-green-500">
                <CheckCircle className="h-5 w-5 text-white" />
            </div>
          ),
        });

        setIsUploading(false);
        setUploadProgress(0);
        form.reset();
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New App</CardTitle>
        <CardDescription>
          Fill in the details and upload the app file.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome App v1.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the new features and improvements..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>App File (.apk, .zip, etc.)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        onChange(e.target.files ? e.target.files[0] : null);
                      }}
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-muted-foreground text-center">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              Upload App
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
