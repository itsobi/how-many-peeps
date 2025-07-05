import Link from 'next/link';
import GoogleSignIn from '@/components/auth/google-sign-in';
import { SignInForm } from '@/components/auth/sign-in-form';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) {
    return redirect('/home');
  }

  return (
    <div className="flex flex-col items-center gap-4 px-1">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <GoogleSignIn buttonText="Continue with Google" />
      <div className="w-full">
        <div className="flex justify-center items-center gap-2.5">
          <hr className="w-[100px] border-t border-slate-200" />
          <p className="text-sm text-gray-500">Or</p>
          <hr className="w-[100px] border-t border-slate-200" />
        </div>
      </div>

      <div className="w-full min-w-[300px] md:min-w-[350px] lg:min-w-[400px]">
        <SignInForm />
      </div>

      <div className="w-full text-xs text-center mt-8">
        <p className="text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      {/* forgot password */}
      <div className="w-full text-xs text-center">
        <Link href="/forgot-password" className="text-primary hover:underline">
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
