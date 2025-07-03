'use client';

import { Lock } from 'lucide-react';

import Image from 'next/image';
import Logo from '../logo';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Props {
  userId: string;
}

export function VenueHeadingSidebar({ userId }: Props) {
  const venue = useQuery(api.venues.getVenueOnClient, {
    externalUserId: userId,
  });

  if (!venue) {
    return (
      <div className="flex items-center justify-center py-2">
        <Logo />
      </div>
    );
  }
  return (
    <div className="flex gap-2 p-4">
      <Image
        src={venue?.imageUrl}
        alt="logo"
        width={32}
        height={32}
        className="rounded object-contain"
      />
      <div className="flex flex-col">
        <p className="font-medium">{venue?.name}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Lock className="w-3 h-3" /> Private
        </p>
      </div>
    </div>
  );
}
