import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import ThemeToggle from './theme-toggle';
import Logo from '../logo';

export function Header() {
  return (
    <header className="border-b py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/home">
            <Logo />
          </Link>
          <div className="ml-4">
            <h4 className="text-sm">Venues</h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <UserButton />
          <div className="h-4 border bg-slate-100 ml-2" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
