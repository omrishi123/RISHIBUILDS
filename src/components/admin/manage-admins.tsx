'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  getAuth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, PlusCircle, AlertCircle, UserPlus } from 'lucide-react';
import { initializeFirebase } from '@/firebase';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export function ManageAdmins() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // We need a separate Firebase app instance to create a user
      // without affecting the current admin's login state.
      const { auth: secondaryAuth } = initializeFirebase();

      // Check if the user already exists
      const signInMethods = await fetchSignInMethodsForEmail(secondaryAuth, values.email);
      if (signInMethods.length > 0) {
        setError('An account with this email address already exists.');
        setIsSubmitting(false);
        return;
      }
      
      await createUserWithEmailAndPassword(secondaryAuth, values.email, values.password);

      toast({
        title: 'Admin Created',
        description: `A new admin account has been created for ${values.email}.`,
      });
      form.reset();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during admin creation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
        <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <UserPlus />
                Create New Admin
            </CardTitle>
            <CardDescription>
            Add a new administrator account. They will have the same permissions as you.
            </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
                {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                )}
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>New Admin's Email</FormLabel>
                    <FormControl>
                        <Input placeholder="new.admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Temporary Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                Create Admin Account
                </Button>
            </CardFooter>
            </form>
        </Form>
        </Card>
    </div>
  );
}