'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAuth, useOrganizationList, useUser } from '@clerk/nextjs';
import {
  ArrowLeftRight,
  Check,
  ChevronsUpDown,
  UserRoundCog,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { SignOutButton } from './sign-out-button';
import { CustomAlertDialog } from './custom-alert-dialog';

export function UserButton({
  header,
  setOpen,
}: {
  header?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const { isLoaded, user } = useUser();
  const { userId, orgId } = useAuth();
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      pageSize: 5,
      keepPreviousData: true,
    },
  });

  const handleUserButtonClick = (
    string: 'personal' | 'organization',
    orgId: string | null
  ) => {
    if (string === 'personal') {
      setOpen?.(false);
      setActive?.({ organization: null });
    } else {
      setOpen?.(false);
      setActive?.({ organization: orgId });
    }
  };

  if (!isLoaded) {
    if (header) {
      return (
        <Avatar className="cursor-pointer">
          <div className="w-full h-full bg-muted animate-pulse rounded-full" />
        </Avatar>
      );
    }
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

  if (!userId) {
    return (
      <CustomAlertDialog
        title="Session not found"
        description="We couldn't find your session. You will be redirected to the sign in page."
        href="/sign-in"
      />
    );
  }

  if (header) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="mr-2">
          <Avatar className="cursor-pointer size-7">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => handleUserButtonClick('personal', null)}
              disabled={!orgId}
            >
              <ArrowLeftRight />
              Personal
              {orgId === null && <Check />}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/settings/manage-account"
                onClick={() => setOpen?.(false)}
              >
                <UserRoundCog />
                Manage Account
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {userMemberships?.data?.map((membership) => (
            <Fragment key={membership.organization.id}>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Organization</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  key={membership.organization.id}
                  onClick={() =>
                    handleUserButtonClick(
                      'organization',
                      membership.organization.id
                    )
                  }
                  disabled={orgId === membership.organization.id}
                >
                  <ArrowLeftRight /> {membership.organization.name}{' '}
                  {orgId === membership.organization.id && <Check />}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </Fragment>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
              <UserRoundCog className="w-4 h-4" />
            )}
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-semibold">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>
          <ChevronsUpDown className="ml-auto w-4 h-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 lg:w-56">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleUserButtonClick('personal', null)}
            disabled={!orgId}
            className="flex items-center"
          >
            <ArrowLeftRight />
            Personal
            {orgId === null && <Check className="ml-auto" />}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/settings/manage-account"
              onClick={() => setOpen?.(false)}
            >
              <UserRoundCog />
              Manage Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {userMemberships?.data?.map((membership) => (
          <Fragment key={membership.organization.id}>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Organization</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                key={membership.organization.id}
                onClick={() =>
                  handleUserButtonClick(
                    'organization',
                    membership.organization.id
                  )
                }
                disabled={orgId === membership.organization.id}
                className="flex items-center"
              >
                <ArrowLeftRight /> {membership.organization.name}{' '}
                {orgId === membership.organization.id && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </Fragment>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
