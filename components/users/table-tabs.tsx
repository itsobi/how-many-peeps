'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { OrgMembersParams, OrgInvitationsParams, roleEnum } from '@/lib/types';
import { useAuth, useOrganization } from '@clerk/nextjs';
import { LoadingView } from '../loading-view';
import { InviteUserDialog } from './invite-user-dialog';
import { DataTable } from './data-table';
import { userColumns } from '../organization/user-columns';
import { invitationColumns } from '../organization/invitation-columns';

export function TableTabs() {
  const { isLoaded: isMembershipsLoaded, memberships } =
    useOrganization(OrgMembersParams);
  const { isLoaded: isInvitationsLoaded, invitations } =
    useOrganization(OrgInvitationsParams);
  const { orgRole } = useAuth();
  const isAdmin = orgRole === 'org:admin';

  if (!isMembershipsLoaded || !isInvitationsLoaded) return <LoadingView />;

  const transformMemberships =
    memberships?.data?.map((member) => ({
      id: member.publicUserData?.userId || '',
      firstName: member.publicUserData?.firstName || '',
      lastName: member.publicUserData?.lastName || '',
      email: member.publicUserData?.identifier || '',
      image: member.publicUserData?.imageUrl || '',
      createdAt: new Date(member.createdAt),
      role: member.role as roleEnum,
    })) || [];

  const transformedInvitations =
    invitations?.data?.map((invitation) => ({
      id: invitation.id,
      email: invitation.emailAddress,
      status: invitation.status || 'unknown',
      createdAt: new Date(invitation.createdAt),
    })) || [];

  return (
    <Tabs defaultValue="users" className="mt-4">
      <TabsList>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="invitations">Invitations</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        {isAdmin && (
          <div className="flex justify-end mb-4">
            <InviteUserDialog />
          </div>
        )}
        <DataTable
          columns={userColumns}
          data={transformMemberships}
          isAdmin={isAdmin}
        />
      </TabsContent>
      <TabsContent value="invitations">
        <div className="mt-16">
          <DataTable
            columns={invitationColumns}
            data={transformedInvitations}
            isAdmin={isAdmin}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
