'use client';

import Link from 'next/link';
import ThemeToggle from './theme-toggle';
import Logo from '../logo';
import { NavLinks } from './nav-links';
import { MobileOrganizationSidebar } from '../organization-sidebar/mobile-organization-sidebar';
import { UserButton } from '../user-button';
import { CreateOrganizationDialog } from '../create-organization/create-organization-dialog';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/venues', label: 'Venues' },
];

export function Header() {
  return (
    <header className="border-b py-2 dark:text-text-dark">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <MobileOrganizationSidebar />

        <div className="hidden md:flex items-center gap-2">
          <Link href="/home">
            <Logo />
          </Link>
          <div className="h-4 border bg-slate-100 mr-4" />
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLinks key={link.href} href={link.href} label={link.label} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <UserButton header />
          <CreateOrganizationDialog />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
