'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function Logo() {
  const { resolvedTheme } = useTheme();
  return (
    <Image
      src={resolvedTheme === 'dark' ? '/white-logo.svg' : '/logo.svg'}
      alt="logo"
      width={32}
      height={32}
    />
  );
}
