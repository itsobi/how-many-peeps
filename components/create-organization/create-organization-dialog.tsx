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
import CreateOrganizationForm from './create-organization-form';
import { useOrganizationList } from '@clerk/nextjs';
import { OrgUserMembershipsParams } from '@/lib/types';

export function CreateOrganizationDialog() {
  const { userMemberships } = useOrganizationList(OrgUserMembershipsParams);

  const belongsToOrganization = userMemberships?.data?.length ? true : false;

  const canCreateOrganization = useQuery(api.users.canUserCreateOrganization);

  if (belongsToOrganization) {
    return null;
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <Building2 />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="mb-6">
            <DialogTitle>
              {canCreateOrganization ? 'Create Organization' : 'Request Access'}
            </DialogTitle>
            <DialogDescription>
              {canCreateOrganization
                ? 'Create a new organization to get started.'
                : 'Oops, it looks your account is not authorized to create an organization. Please fill out this form to request access.'}
            </DialogDescription>
          </DialogHeader>
          {canCreateOrganization ? (
            <CreateOrganizationForm />
          ) : (
            <RequestAccessForm />
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
}
