import { CustomAlertDialog } from '@/components/custom-alert-dialog';
import { PageHeading } from '@/components/page-heading';
import { usersColumns } from '@/components/users/user-columns';
import { DataTable } from '@/components/users/data-table';
import { InviteUserDialog } from '@/components/users/invite-user-dialog';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { clerkClient } from '@/lib/clerk-client';
import { Suspense } from 'react';

export default async function UsersPage() {
  const { userId, orgId } = await auth();

  if (!orgId) {
    if (!userId) {
      redirect('/');
    }
    return (
      <CustomAlertDialog
        title="Unauthorized"
        description="You must be a member of an organization or set to your organization via the user button to access this page."
        href="/home"
      />
    );
  }

  const orgUsers =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const transformedOrgUsers = orgUsers.data.map((membership) => ({
    id: membership.publicUserData?.userId || '',
    firstName: membership.publicUserData?.firstName || '',
    lastName: membership.publicUserData?.lastName || '',
    email: membership.publicUserData?.identifier || '',
    image: membership.publicUserData?.imageUrl || '',
    createdAt: new Date(membership.createdAt),
    role: (membership.role === 'org:admin' ? 'admin' : 'user') as
      | 'admin'
      | 'user',
  }));

  return (
    <>
      <PageHeading title="Users" description="Manage your users" />

      <div className="flex justify-end mb-4">
        <InviteUserDialog />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable columns={usersColumns} data={transformedOrgUsers} />
      </Suspense>
    </>
  );
}
