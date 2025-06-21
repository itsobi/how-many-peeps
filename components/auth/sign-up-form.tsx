'use client';

import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { useSignUp } from '@clerk/nextjs';
import { ClerkAPIError } from '@clerk/types';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<ClerkAPIError[]>();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [signUpPending, startSignUpTransition] = useTransition();
  const [verifyPending, startVerifyTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setErrors(undefined);
    if (!isLoaded) return;

    startSignUpTransition(async () => {
      try {
        await signUp.create({
          emailAddress: values.email,
          password: values.password,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });
        toast.info(`A verification email was sent to ${values.email}`);
        setVerifying(true);
      } catch (error) {
        console.error(error);
        if (isClerkAPIResponseError(error)) {
          setErrors(error.errors);
          toast.error(error.errors[0].longMessage);
        } else {
          toast.error('Failed to create your account. Try again.');
        }
      }
    });
  };

  const handleVerify = () => {
    if (!isLoaded) return;

    startVerifyTransition(async () => {
      try {
        const signUpAttempt = await signUp.attemptEmailAddressVerification({
          code,
        });

        if (signUpAttempt.status === 'complete') {
          await setActive({ session: signUpAttempt.createdSessionId });
          toast.success('Verification was successful, have fun inside!');
          router.push('/home');
        } else {
          console.error(signUpAttempt);
          toast.error(
            'There was an issue verifying your email, please try again'
          );
        }
      } catch (error) {
        console.error(error);
        toast.error(
          isClerkAPIResponseError(error)
            ? error.errors[0].longMessage
            : 'There was an issue verifying your email, please try again'
        );
      }
    });
  };

  if (verifying) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.length !== 6) {
            toast.error('Please enter the 6-digit code');
            return;
          }
          handleVerify();
        }}
        className="flex flex-col gap-4 mt-4"
      >
        <h2 className="text-center text-lg font-medium">Verify your email</h2>
        <p className="text-center text-sm text-muted-foreground">
          We sent a verification code to your email
        </p>
        <div className="flex justify-center gap-2">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={code}
            onChange={(value) => setCode(value)}
            inputMode="numeric"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="w-full"
          type="submit"
          disabled={code.length !== 6 || verifyPending}
        >
          {verifyPending ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>
    );
  }

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

        {/* Bot protection */}
        <div id="clerk-captcha" />

        <Button
          disabled={
            !form.formState.isValid ||
            form.formState.isSubmitting ||
            signUpPending
          }
          type="submit"
          className="w-full"
        >
          {form.formState.isSubmitting || signUpPending
            ? 'Creating account...'
            : 'Create account'}
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
