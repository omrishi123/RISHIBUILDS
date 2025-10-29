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
import { Loader2, UploadCloud, CheckCircle } from 'lucide-react';

import { collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';

const formSchema = z.object({
  name: z.string().min(3, 'App name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  downloadUrl: z.string().url('Please enter a valid URL.'),
});

export function UploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      downloadUrl: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    addDocumentNonBlocking(collection(firestore, 'appArtifacts'), {
      ...values,
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
