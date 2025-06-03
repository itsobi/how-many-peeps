'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props {
  href: string;
  label: string;
}

export function NavLinks({ href, label }: Props) {
  const pathname = usePathname();

  const isActive = pathname.includes(href);
  return (
    <Link
      href={href}
      className={cn(
        'text-sm',
        isActive && 'font-semibold underline underline-offset-4 decoration-2'
      )}
    >
      {label}
    </Link>
  );
}
