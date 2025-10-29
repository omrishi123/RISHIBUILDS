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
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  downloadUrl: z.string().url('Please enter a valid URL.'),
  logo: z.any().refine(file => file?.length == 1 ? file[0].size <= 500000 : true, `Max image size is 500KB.`).refine(
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

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    let logoBase64: string | undefined = undefined;
    if (values.logo && values.logo.length > 0) {
        logoBase64 = await getBase64(values.logo[0]);
    }

    const { logo, ...submissionData } = values;

    addDocumentNonBlocking(collection(firestore, 'appArtifacts'), {
      ...submissionData,
      logoBase64,
      createdAt: serverTimestamp(),
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
