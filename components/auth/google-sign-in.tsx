'use client';

import { useSignIn } from '@clerk/nextjs';
import { GoogleLogo } from './google-logo';
import { toast } from 'sonner';

export default function GoogleSignIn({ buttonText }: { buttonText: string }) {
  const { signIn } = useSignIn();

  const handleSignIn = async () => {
    if (!signIn) return;
    const loadingToast = toast.loading('Signing in with Google...');
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sign-in/sso-callback',
        redirectUrlComplete: '/home',
      });
      toast.dismiss(loadingToast);
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      toast.error('Failed to sign in with Google');
    } finally {
      toast.dismiss(loadingToast);
    }
  };
  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 border rounded-full px-12 py-2 hover:bg-slate-100 cursor-pointer dark:hover:bg-muted-foreground transition-colors duration-300 ease-in-out"
    >
      <GoogleLogo />
      <p className="text-xs lg:text-base">{buttonText}</p>
    </button>
  );
}
