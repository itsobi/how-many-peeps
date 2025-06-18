'use client';

import { useOrganization } from '@clerk/nextjs';
import { Lock } from 'lucide-react';

import Image from 'next/image';
import Logo from '../logo';

export function OrganizationHeadingSidebar() {
  const { isLoaded, organization } = useOrganization();

  if (!isLoaded) {
    return (
      <div className="flex gap-2 p-4">
        <div className="w-8 h-8 rounded bg-muted animate-pulse" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-3 w-16 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex items-center justify-center py-2">
        <Logo />
      </div>
    );
  }
  return (
    <div className="flex gap-2 p-4">
      <Image
        src={organization?.imageUrl}
        alt="logo"
        width={32}
        height={32}
        className="rounded object-contain"
      />
      <div className="flex flex-col">
        <p className="font-medium">{organization?.name}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Lock className="w-3 h-3" /> Private
        </p>
      </div>
    </div>
  );
}
