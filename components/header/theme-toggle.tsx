'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return <Button variant="ghost" className="w-9 h-9" />;
  }

  return (
    <Button variant="ghost" onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}
