import { CustomAlertDialog } from '@/components/custom-alert-dialog';
import { PageHeading } from '@/components/page-heading';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { TableTabs } from '@/components/users/table-tabs';

export default async function UsersPage() {
  const { userId, orgId } = await auth();

  if (!orgId) {
    if (!userId) {
      return redirect('/');
    }
    return (
      <CustomAlertDialog
        title="Unauthorized"
        description="You must be a member of an organization or set to your organization via the user button to access this page."
        href="/home"
      />
    );
  }

  return (
    <>
      <PageHeading title="Users" description="Manage your users" />
      <TableTabs />
    </>
  );
}
