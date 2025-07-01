'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Building2 } from 'lucide-react';
import { RequestAccessForm } from './request-access-form';
import { CreateVenueForm } from './create-venue-form';
import { useOrganizationList } from '@clerk/nextjs';
import { OrgUserMembershipsParams } from '@/lib/types';
import { useState } from 'react';

export function CreateVenueDialog() {
  const [open, setOpen] = useState(false);
  const { userMemberships } = useOrganizationList(OrgUserMembershipsParams);

  const belongsToOrganization = userMemberships?.data?.length ? true : false;

  const canCreateVenue = useQuery(api.users.canUserCreateVenue);

  if (belongsToOrganization) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Building2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-6">
          <DialogTitle>
            {canCreateVenue ? 'Create Venue' : 'Request Access'}
          </DialogTitle>
          <DialogDescription>
            {canCreateVenue
              ? 'Create a new venue to get started.'
              : 'Oops, it looks your account is not authorized to create a venue. Please fill out this form to request access.'}
          </DialogDescription>
        </DialogHeader>
        {canCreateVenue ? (
          <CreateVenueForm setOpen={setOpen} />
        ) : (
          <RequestAccessForm setOpen={setOpen} />
        )}
      </DialogContent>
    </Dialog>
  );
}
