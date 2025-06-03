'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a placeholder during SSR and initial client render
  if (!mounted) {
    return <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />;
  }

  if (resolvedTheme === 'dark') {
    return <Image src="/white-logo.svg" alt="logo" width={32} height={32} />;
  }

  return <Image src="/logo.svg" alt="logo" width={32} height={32} />;
}
