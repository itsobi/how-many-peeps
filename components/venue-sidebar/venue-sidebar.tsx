import { Lock, Users, Pencil, Building } from 'lucide-react';
import SidebarLink from '../header/sidebar-link';
import Image from 'next/image';
import { SidebarUserButton } from './sidebar-user-button';

const sidebarItems = [
  {
    label: 'Counter',
    icon: <Pencil className="w-4 h-4" />,
    href: '/counter',
  },
  {
    label: 'Users',
    icon: <Users className="w-4 h-4" />,
    href: '/users',
  },
];

export function VenueSidebar() {
  return (
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
            <p className="font-medium">Shangri-La</p>
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
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>

      <div className="mt-auto pb-4">
        <SidebarUserButton />
      </div>
    </aside>
  );
}
