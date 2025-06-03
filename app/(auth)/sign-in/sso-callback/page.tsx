'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Clerk } from '@clerk/clerk-js';

export default function SSOCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const clerk = new Clerk(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!);
        await clerk.load();
        await clerk.handleRedirectCallback();
        router.push('/home');
      } catch (error) {
        console.error(JSON.stringify(error, null, 2));
        router.push('/sign-in');
        toast.error('Failed to sign in with Google');
      }
    };
    handleRedirect();
  }, [router]);
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen text-muted-foreground">
      <h1 className="text-2xl font-bold">Signing in with Google...</h1>
      <p className="text-sm">Please wait while we sign you in...</p>
      <Loader2 className="w-4 h-4 animate-spin" />
    </div>
  );
}
