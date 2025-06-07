'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Lock,
  Users,
  Menu,
  Home,
  Building,
  Calculator,
  Settings,
} from 'lucide-react';
import SidebarLink from '../header/sidebar-link';
import Image from 'next/image';
import { SidebarUserButton } from './sidebar-user-button';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

const sidebarItems = [
  {
    label: 'Home',
    icon: <Home className="w-4 h-4" />,
    href: '/home',
  },
  {
    label: 'Venues',
    icon: <Building className="w-4 h-4" />,
    href: '/venues',
  },
];

const privateVenueItems = [
  {
    label: 'Counter',
    icon: <Calculator className="w-4 h-4" />,
    href: '/counter',
  },
  {
    label: 'Users',
    icon: <Users className="w-4 h-4" />,
    href: '/users',
  },
  {
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
    href: '/settings',
  },
];

export function MobileVenueSidebar() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden cursor-pointer" asChild>
        <Button variant="ghost">
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="h-full p-0">
        <SheetHeader aria-label="Shangri-La" className="sr-only" />
        <SheetTitle aria-label="Shangri-La" className="sr-only" />
        <SheetDescription aria-label="Shangri-La venue sidebar" />
        <aside className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b">
            <div className="flex gap-2 p-4">
              <Image
                src="/shangrila.jpeg"
                alt="logo"
                width={32}
                height={32}
                className="rounded object-cover"
              />
              <div className="flex flex-col">
                <p>Shangri-La</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Private
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="p-4 flex flex-col gap-2 text-sm">
            {sidebarItems.map((item) => (
              <SidebarLink
                onClick={() => setOpen(false)}
                key={item.label}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>

          <div className="border-b" />

          {/* Private Venue Menu */}
          <div className="p-4 flex flex-col gap-2 text-sm">
            <h4 className="text-xs text-muted-foreground">Venue Access</h4>
            {privateVenueItems.map((item) => (
              <SidebarLink
                onClick={() => setOpen(false)}
                key={item.label}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </div>

          <div className="mt-auto pb-4">
            <SidebarUserButton setOpen={setOpen} />
          </div>
        </aside>
      </SheetContent>
    </Sheet>
  );
}
