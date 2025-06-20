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
  Menu,
  Home,
  Calculator,
  Settings,
  UsersRound,
  Building2,
} from 'lucide-react';
import SidebarLink from '../header/sidebar-link';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { UserButton } from '../user-button';
import { useAuth } from '@clerk/nextjs';
import { OrganizationHeadingSidebar } from './organization-heading-sidebar';

const sidebarItems = [
  {
    label: 'Home',
    icon: <Home className="w-4 h-4" />,
    href: '/home',
  },
  {
    label: 'Venues',
    icon: <Building2 className="w-4 h-4" />,
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
    icon: <UsersRound className="w-4 h-4" />,
    href: '/users',
  },
  {
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
    href: '/settings',
  },
];

function OrganizationLinks({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { orgId, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!orgId) {
    return null;
  }

  return (
    <>
      <div className="border-b" />

      {/* Private Venue Menu */}
      <div className="p-4 flex flex-col gap-2 text-sm">
        <h4 className="text-xs text-muted-foreground">Organization Access</h4>
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
    </>
  );
}

export function MobileOrganizationSidebar() {
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
            <OrganizationHeadingSidebar />
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

          <OrganizationLinks setOpen={setOpen} />

          <div className="mt-auto pb-4">
            <UserButton setOpen={setOpen} />
          </div>
        </aside>
      </SheetContent>
    </Sheet>
  );
}
