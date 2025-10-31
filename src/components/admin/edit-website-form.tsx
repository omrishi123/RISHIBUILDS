
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Website } from '@/types';
import {
  CardContent,
  CardFooter
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  url: z.string().url('Must be a valid URL.'),
  description: z.string().min(5, 'Description is required.'),
});

type FormValues = z.infer<typeof formSchema>;

type EditWebsiteFormProps = {
    website: Website;
    onSuccess: () => void;
}

export function EditWebsiteForm({ website, onSuccess }: EditWebsiteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: website.name || '',
      url: website.url || '',
      description: website.description || '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    const websiteRef = doc(firestore, 'websites', website.id);
    
    updateDocumentNonBlocking(websiteRef, values);
    
    toast({
        title: 'Success!',
        description: 'The website link has been updated successfully.',
    });

    setIsSubmitting(false);
    onSuccess();
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Website Name</FormLabel>
                        <FormControl><Input placeholder="E.g., Google" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="url" render={({ field }) => (
                    <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl><Input placeholder="https://google.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Input placeholder="A short description of the website." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
  );
}
