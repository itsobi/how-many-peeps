import { Calculator, Settings, UsersRound } from 'lucide-react';
import SidebarLink from '../header/sidebar-link';
import { UserButton } from '../user-button';
import { OrganizationHeadingSidebar } from './organization-heading-sidebar';
import { auth } from '@clerk/nextjs/server';
import { Button } from '../ui/button';

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

export async function OrganizationSidebar() {
  const { userId, orgId } = await auth();

  if (!orgId) {
    return null;
  }

  return (
    <aside className="hidden lg:block lg:border-r w-1/4">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b">
          <OrganizationHeadingSidebar />
        </div>

        {/* Menu */}
        <div className="p-4 flex flex-col gap-2 text-sm">
          {privateVenueItems.map((item) => (
            <SidebarLink
              key={item.label}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>

        <div className="mt-auto pb-4">
          <UserButton />
        </div>
      </div>
    </aside>
  );
}
