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

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSignUp } from '@clerk/nextjs';
import { ClerkAPIError } from '@clerk/types';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { useState, useRef } from 'react';
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
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(6).fill('')
  );
  const [errors, setErrors] = useState<ClerkAPIError[]>();
  const router = useRouter();

  const inputRefs = Array(6)
    .fill(0)
    .map(() => useRef<HTMLInputElement>(null));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setErrors(undefined);
    if (!isLoaded) return;
    const signUpToast = toast.loading('Creating your account...');
    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      toast.dismiss(signUpToast);
      toast.info('A verification email was sent to the provided email.');
      setVerifying(true);
    } catch (error) {
      toast.dismiss(signUpToast);
      console.error(JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        toast.error(error.errors[0].message);
        setErrors(error.errors);
      } else {
        toast.error('Failed to create your account. Try again.');
      }
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    const joinedCode = verificationCode.join('').trim();
    const loadingToast = toast.loading('Verifying your code...');
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: joinedCode,
      });

      if (signUpAttempt.status === 'complete') {
        toast.dismiss(loadingToast);
        await setActive({ session: signUpAttempt.createdSessionId });
        toast.success('Verification was successful, have fun inside!');

        router.push('/home');
      } else {
        toast.dismiss(loadingToast);
        console.error(JSON.stringify(signUpAttempt, null, 2));
        toast.error(
          'There was an issue verifying your email, please try again'
        );
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error:', JSON.stringify(error, null, 2));
      toast.error(
        error instanceof Error
          ? error.message
          : 'There was an issue verifying your email, please try again'
      );
    }
  };

  if (verifying) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!verificationCode.some((v) => !v)) {
            handleVerify();
          }
        }}
        className="flex flex-col gap-4 mt-4"
      >
        <h2 className="text-center text-lg font-medium">Verify your email</h2>
        <p className="text-center text-sm text-muted-foreground">
          We sent a verification code to your email
        </p>
        <div className="flex justify-center gap-2">
          {verificationCode.map((value, index) => (
            <Input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              className="w-10 h-10 text-center"
              value={value}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputMode="numeric"
            />
          ))}
        </div>
        <Button
          className="w-full"
          type="submit"
          disabled={verificationCode.some((v) => !v)}
        >
          Verify Email
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

        <Button type="submit" className="w-full">
          Create account
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
