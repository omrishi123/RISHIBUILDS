

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
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, CheckCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

import { collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';

const formSchema = z.object({
  name: z.string().min(3, 'App name must be at least 3 characters.'),
  version: z.string().min(1, 'Version is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  downloadUrl: z.string().url('Please enter a valid URL.'),
  logo: z.any().refine(
    file => file?.length == 1 ? ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file[0].type) : true,
    "Only .jpg, .png, .webp and .svg formats are supported."
  ).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function UploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      version: '',
      description: '',
      downloadUrl: '',
    },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error("Could not get canvas context"));

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality JPEG
        }
        img.onerror = (error) => reject(error);
      }
      reader.onerror = (error) => reject(error);
    });
  }

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    let logoBase64: string | undefined = undefined;
    if (values.logo && values.logo.length > 0) {
        const file: File = values.logo[0];
        if (file.size > 500000) { // 500KB
            try {
                logoBase64 = await compressImage(file);
                toast({ title: 'Image Compressed', description: 'Logo was larger than 500KB and has been automatically compressed.' });
            } catch (error) {
                toast({ variant: 'destructive', title: 'Compression Failed', description: 'Could not compress image.' });
                setIsSubmitting(false);
                return;
            }
        } else {
            logoBase64 = await getBase64(file);
        }
    }

    const { logo, ...submissionData } = values;

    addDocumentNonBlocking(collection(firestore, 'appArtifacts'), {
      ...submissionData,
      logoBase64,
      downloadCount: 0,
      createdAt: serverTimestamp(),
      isPinned: false, // Default to not pinned
    }).then(() => {
        toast({
            title: 'Success!',
            description: 'Your app has been added successfully.',
            action: (
              <div className="p-1 rounded-full bg-green-500">
                  <CheckCircle className="h-5 w-5 text-white" />
              </div>
            ),
          });
  
          setIsSubmitting(false);
          form.reset();
          setPreview(null);
    }).catch(err => {
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: err.message,
          });
          setIsSubmitting(false);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New App</CardTitle>
        <CardDescription>
          Fill in the details and provide the direct download link.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>App Name</FormLabel>
                    <FormControl>
                        <Input placeholder="My Awesome App" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>App Version</FormLabel>
                    <FormControl>
                        <Input placeholder="1.0.0" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
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
              name="downloadUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Download URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.mediafire.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Logo</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg border bg-secondary flex items-center justify-center">
                            {preview ? (
                                <Image src={preview} alt="Logo preview" width={64} height={64} className="rounded-lg object-cover w-16 h-16" />
                            ) : (
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            handleLogoChange(e);
                          }}
                        />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              Add App
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
