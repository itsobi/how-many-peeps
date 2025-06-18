'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';

import { useAuth, useSignIn } from '@clerk/nextjs';
import React, { useState } from 'react';
import { SetActive, SignInResource } from '@clerk/types';
import { Label } from '../ui/label';

const provideEmailFormSchema = z.object({
  email: z.string().email(),
});

function ProvideEmail({
  isLoaded,
  signIn,
  setStep,
  error,
  setError,
}: {
  isLoaded: boolean;
  signIn: SignInResource | undefined;
  setStep: (step: 'provideEmail' | 'resetPassword') => void;
  error: string;
  setError: (error: string) => void;
}) {
  const provideEmailForm = useForm<z.infer<typeof provideEmailFormSchema>>({
    resolver: zodResolver(provideEmailFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleProvideEmail = async (
    values: z.infer<typeof provideEmailFormSchema>
  ) => {
    if (!isLoaded) return;
    const loadingToast = toast.loading('Sending reset password email...');
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: values.email,
      })
      .then((_) => {
        setStep('resetPassword');
        toast.dismiss(loadingToast);
        toast.info('A code has been sent to the provided email');
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  };
  return (
    <Form {...provideEmailForm}>
      <form
        onSubmit={provideEmailForm.handleSubmit(handleProvideEmail)}
        className="space-y-4 w-full"
      >
        <FormField
          control={provideEmailForm.control}
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

        <Button
          disabled={
            !provideEmailForm.formState.isValid ||
            provideEmailForm.formState.isSubmitting
          }
          type="submit"
          className="w-full"
        >
          Send Code
        </Button>
        {error && <p>{error}</p>}
      </form>
    </Form>
  );
}

const resetPasswordFormSchema = z.object({
  code: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

function ResetPassword({
  isLoaded,
  signIn,
  error,
  setError,
  setActive,
}: {
  setStep: (step: 'provideEmail' | 'resetPassword') => void;
  isLoaded: boolean;
  signIn: SignInResource | undefined;
  error: string;
  setError: (error: string) => void;
  setActive: SetActive | undefined;
}) {
  const resetPasswordForm = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      code: '',
      password: '',
    },
  });

  const handleResetPassword = async (
    values: z.infer<typeof resetPasswordFormSchema>
  ) => {
    if (!isLoaded || !setActive) return;
    const loadingToast = toast.loading('Resetting your password...');

    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: values.code,
        password: values.password,
      })
      .then((result) => {
        toast.dismiss(loadingToast);
        if (result.status === 'complete') {
          setActive({ session: result.createdSessionId });
          toast.success(
            'Password successfully reset, routing you to the Home page!'
          );
          setError('');
        } else {
          toast.error(
            'Sorry something went wrong while trying to update your password'
          );
        }
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  };
  return (
    <Form {...resetPasswordForm}>
      <form
        onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}
        className="space-y-4 w-full"
      >
        <FormField
          control={resetPasswordForm.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Code" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={resetPasswordForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="New Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={
            !resetPasswordForm.formState.isValid ||
            resetPasswordForm.formState.isSubmitting
          }
          type="submit"
          className="w-full"
        >
          Reset Password
        </Button>
        {error && <p>{error}</p>}
      </form>
    </Form>
  );
}

export function ForgotPasswordForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'provideEmail' | 'resetPassword'>(
    'provideEmail'
  );
  const [error, setError] = useState('');

  if (step === 'provideEmail') {
    return (
      <ProvideEmail
        isLoaded={isLoaded}
        signIn={signIn}
        setStep={setStep}
        error={error}
        setError={setError}
      />
    );
  }

  if (step === 'resetPassword') {
    return (
      <ResetPassword
        isLoaded={isLoaded}
        signIn={signIn}
        setStep={setStep}
        error={error}
        setError={setError}
        setActive={setActive}
      />
    );
  }

  return null;
}
