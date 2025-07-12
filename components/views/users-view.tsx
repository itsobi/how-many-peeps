'use client';

import { CustomAlertDialog } from '../custom-alert-dialog';
import { redirect } from 'next/navigation';
import { TableTabs } from '../users/table-tabs';
import { useAuth } from '@clerk/nextjs';
import { LoadingView } from '../loading-view';

export function UsersView() {
  const { isLoaded, userId, orgId } = useAuth();

  if (!isLoaded) {
    return <LoadingView />;
  }

  if (isLoaded && !orgId) {
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
