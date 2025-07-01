'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '../ui/button';
import { EllipsisIcon, Shield, UserRound, UserRoundX } from 'lucide-react';
import { useAuth, useOrganization } from '@clerk/nextjs';
import { toast } from 'sonner';
import { revokeInvitation } from '@/lib/actions/revoke-invitation';
import { Invitation, OrgInvitationsParams, roleEnum, User } from '@/lib/types';
import { updateOrgMembership } from '@/lib/actions/update-venue-membership';
import { removeUserFromVenue } from '@/lib/actions/venue-remove-user';
import { useState } from 'react';

export function ActionsDropdown({
  invitations,
  row,
}: {
  invitations?: boolean;
  row: Invitation | User;
}) {
  const { userId, orgId, isLoaded: isAuthLoaded } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoaded,
    invitations: invitationsList,
    memberships,
  } = useOrganization(OrgInvitationsParams);

  const handleRevokeInvitation = (invitationId: string) => {
    // invitationId will come from row.id - the invitation id
    toast.promise(
      revokeInvitation({
        orgId,
        invitationId: invitationId,
        requestingUserId: userId,
      }),
      {
        loading: 'Revoking invitation...',
        success: (data) => {
          if (isLoaded) {
            invitationsList?.revalidate?.();
          }
          return data.message;
        },
        error: (error) => {
          return error.message;
        },
      }
    );
  };

  const handleUpdateOrgMembership = (userId: string) => {
    // userId comes from row.id - the userId of the user
    if (!isAuthLoaded) {
      toast.error('Instance is not loaded. Please try again');
      return;
    }
    if (!('role' in row)) {
      toast.error('Unable to update membership');
      return;
    } // Type guard for User
    toast.promise(
      updateOrgMembership({
        organizationId: orgId,
        userId,
        role: row.role === roleEnum.ADMIN ? roleEnum.MEMBER : roleEnum.ADMIN,
      }),
      {
        loading: 'Updating...',
        success: (data) => {
          memberships?.revalidate?.();
          return data.message;
        },
        error: (error) => {
          return error.message;
        },
      }
    );
  };

  const handleRemoveUserFromOrg = (userId: string) => {
    // userId will be coming from row.id - userId of user
    toast.promise(
      removeUserFromVenue({
        venueId: orgId,
        userId,
      }),
      {
        loading: 'Removing user...',
        success: (data) => {
          memberships?.revalidate?.();
          return data.message;
        },
        error: (error) => {
          return error.message;
        },
      }
    );
  };
  if (invitations) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleRevokeInvitation(row.id)}>
            <span className="flex items-center gap-2 text-red-400">
              <UserRoundX className="text-red-400" /> Revoke invitation
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleUpdateOrgMembership(row.id)}>
          <span className="flex items-center gap-2">
            {'role' in row && row.role === roleEnum.ADMIN ? (
              <UserRound />
            ) : (
              <Shield />
            )}{' '}
            Set to{' '}
            {'role' in row && row.role === roleEnum.ADMIN ? 'member' : 'admin'}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (
              window.confirm(
                'Are you sure you want to remove this user from the venue?'
              )
            ) {
              handleRemoveUserFromOrg(row.id);
              return;
            }
          }}
        >
          <span className="flex items-center gap-2 text-red-400">
            <UserRoundX className="text-red-400" /> Remove user from venue
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
