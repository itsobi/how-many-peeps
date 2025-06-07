'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useUser } from '@clerk/nextjs';
import { User, ChevronsUpDown, UserCog } from 'lucide-react';
import Image from 'next/image';
import { SignOutButton } from '../sign-out-button';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

export function SidebarUserButton({
  setOpen,
}: {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="border rounded-sm shadow-sm p-2 mx-2 flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 bg-muted animate-pulse rounded" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-muted animate-pulse rounded-full border-2" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-3 w-24 bg-muted animate-pulse rounded" />
          <div className="h-3 w-32 bg-muted animate-pulse rounded" />
        </div>
        <ChevronsUpDown className="ml-auto w-4 h-4 text-muted" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="border rounded-sm shadow-sm p-2 mx-2 flex items-center gap-2 cursor-pointer">
          <div className="relative">
            {user?.imageUrl ? (
              <Image
                src={user?.imageUrl}
                alt="user"
                width={32}
                height={32}
                className="rounded"
              />
            ) : (
              <User className="w-4 h-4" />
            )}
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex flex-col">
            <p className="text-xs">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>
          <ChevronsUpDown className="ml-auto w-4 h-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 lg:w-56">
        <DropdownMenuLabel className="text-muted-foreground">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild onClick={() => setOpen?.(false)}>
          <Link href="/settings/manage-account">
            <UserCog />
            Manage Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={() => setOpen?.(false)}>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
