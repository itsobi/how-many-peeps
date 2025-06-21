import { auth } from '@clerk/nextjs/server';
import { CustomAlertDialog } from '../custom-alert-dialog';
import { redirect } from 'next/navigation';
import { TableTabs } from '../users/table-tabs';

export async function UsersView() {
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

  return <TableTabs />;
}
