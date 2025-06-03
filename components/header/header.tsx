import Link from 'next/link';
import ThemeToggle from './theme-toggle';
import Logo from '../logo';
import { NavLinks } from './nav-links';
import { MobileVenueSidebar } from '../venue-sidebar/mobile-venue-sidebar';
import { HeaderUserButton } from './header-user-button';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/venues', label: 'Venues' },
];

export function Header() {
  return (
    <header className="border-b py-2 dark:text-text-dark">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <MobileVenueSidebar />

        <div className="hidden md:flex items-center gap-2">
          <Link href="/home">
            <Logo />
          </Link>
          <div className="h-4 border bg-slate-100 mr-4" />
          <div className="flex items-center gap-4">
            {navLinks.map((link) => (
              <NavLinks key={link.href} href={link.href} label={link.label} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <HeaderUserButton />
          <div className="h-4 border bg-slate-100 ml-2" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
