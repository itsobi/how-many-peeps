'use client';

import { ThemeToggle } from './theme-toggle';
import Logo from '../logo';
import { NavLinks } from './nav-links';
import { UserButton } from '../user-button';
import { CreateVenueDialog } from '../create-venue/create-venue-dialog';
import { MobileVenueSidebar } from '../venue-sidebar/mobile-venue-sidebar';

const navLinks = [{ href: '/home', label: 'Home' }];

export function Header() {
  return (
    <header className="border-b py-2 dark:text-text-dark">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <MobileVenueSidebar />

        <div className="hidden md:flex items-center gap-2">
          <Logo />
          <div className="h-4 border bg-slate-100 mr-4" />
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLinks key={link.href} href={link.href} label={link.label} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <UserButton header />
          <CreateVenueDialog />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
