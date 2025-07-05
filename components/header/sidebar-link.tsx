'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export default function SidebarLink({ href, icon, label, onClick }: Props) {
  const pathname = usePathname();

  const isActive = pathname.includes(href);
  return (
    <Link
      onClick={onClick}
      href={href}
      key={label}
      className={cn(
        'flex items-center gap-2 dark:text-text-dark hover:bg-secondary rounded-md p-2 transition-colors duration-200',
        isActive && 'font-semibold bg-secondary text-black'
      )}
    >
      {icon}
      <p>{label}</p>
    </Link>
  );
}
