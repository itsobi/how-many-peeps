'use client';

import { ThemeToggle } from '../header/theme-toggle';
import Logo from '../logo';

export function PublicHeader() {
  return (
    <header className="p-4 flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
