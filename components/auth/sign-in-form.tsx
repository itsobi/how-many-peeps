'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSignIn } from '@clerk/nextjs';
import { ClerkAPIError } from '@clerk/types';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [errors, setErrors] = useState<ClerkAPIError[]>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setErrors(undefined);
    if (!isLoaded) return;
    const loadingToast = toast.loading('Signing you in...');
    try {
      const signInAttempt = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        toast.dismiss(loadingToast);
        toast.success('Successfully signed in, have fun inside!');
        router.push('/home');
      } else {
        toast.dismiss(loadingToast);
        console.error(JSON.stringify(signInAttempt, null, 2));
        toast.error('There was an issue signing you in, please try again');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        toast.error(error.errors[0].message);
        setErrors(error.errors);
      } else {
        toast.error('Failed to create your account. Try again.');
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} />
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
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          Sign in
        </Button>

        {errors && (
          <ul>
            {errors.map((el, index) => (
              <li key={index} className="text-red-500 text-xs">
                {el.longMessage}
              </li>
            ))}
          </ul>
        )}
      </form>
    </Form>
  );
}
