import { ForgotPasswordForm } from '@/components/auth/forgot-passowrd-form';
import Logo from '@/components/logo';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ForgotPasswordPage() {
  const { userId } = await auth();
  if (userId) {
    redirect('/home');
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Logo />
      <h1 className="text-2xl font-semibold">Forgot Password</h1>
      <ForgotPasswordForm />

      <Link
        href={'/sign-in'}
        className="mt-8 text-xs hover:underline underline-offset-4 text-muted-foreground"
      >
        Back to Sign In
      </Link>
    </div>
  );
}
