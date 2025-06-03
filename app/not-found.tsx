import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <Image src="/logo.svg" alt="Logo" width={100} height={100} />
      <h2 className="text-2xl font-medium">Not Found</h2>
      <p className="text-sm">This page does not exist.</p>
      <Link
        href="/home"
        className="hover:underline underline-offset-4 hover:text-muted-foreground text-sm"
      >
        Return Home
      </Link>
    </div>
  );
}
