'use client';

import { useClerk } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function SignOutButton({ className }: { className?: string }) {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    const loadingToast = toast.loading('Signing you out...');
    try {
      await signOut({ redirectUrl: '/' });
    } catch (error) {
      toast.error('Failed to sign out');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className={`hover:bg-[#f5f5f5] dark:hover:bg-[#404040] w-full transition-colors duration-200 ease-in-out ${className}`}
    >
      <span className="flex items-center gap-2">
        <LogOut className="w-4 h-4" />
        Sign Out
      </span>
    </button>
  );
}
