'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a placeholder during SSR and initial client render
  if (!mounted) {
    return <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />;
  }

  if (resolvedTheme === 'dark') {
    return (
      <Link href="/">
        <Image src="/white-logo.svg" alt="logo" width={32} height={32} />
      </Link>
    );
  }

  return (
    <Link href="/">
      <Image src="/logo.svg" alt="logo" width={32} height={32} />
    </Link>
  );
}
