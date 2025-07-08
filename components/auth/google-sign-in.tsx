'use client';

import { useSignIn } from '@clerk/nextjs';
import { GoogleLogo } from './google-logo';
import { toast } from 'sonner';
import { useTransition } from 'react';

export default function GoogleSignIn({ buttonText }: { buttonText: string }) {
  const { signIn } = useSignIn();
  const [isPending, startTransition] = useTransition();

  const handleSignIn = () => {
    if (!signIn) return;
    toast.info('Signing in with Google...');
    startTransition(async () => {
      try {
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/sign-in/sso-callback',
          redirectUrlComplete: '/home',
        });
      } catch (error) {
        console.error(JSON.stringify(error, null, 2));
        toast.error('Failed to sign in with Google');
      }
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 rounded-full px-12 py-2 bg-black text-white hover:bg-black/85 dark:hover:bg-black/40 cursor-pointer transition-colors duration-300 ease-in-out"
      disabled={isPending}
    >
      <GoogleLogo />
      <p className="text-xs">
        {isPending ? 'Verifying credentials...' : buttonText}
      </p>
    </button>
  );
}
