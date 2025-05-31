'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export default function SidebarLink({ href, icon, label }: Props) {
  const pathname = usePathname();

  const isActive = pathname === href;
  return (
    <Link
      href={href}
      key={label}
      className={cn(
        'flex items-center gap-2 hover:bg-[#f5f5f5] dark:hover:bg-[#404040] rounded-md p-2 transition-colors duration-200',
        isActive && ' bg-[#f5f5f5] dark:bg-[#404040]'
      )}
    >
      {icon}
      <p>{label}</p>
    </Link>
  );
}
