import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/logo';

export default function NotFound() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <Logo />
      <h2 className="text-2xl font-medium">Not Found</h2>
      <p className="text-sm">This page does not exist.</p>
      <Link
        href="/home"
        className="hover:underline underline-offset-4 text-cyan-700 text-sm"
      >
        Return Home
      </Link>
    </div>
  );
}
