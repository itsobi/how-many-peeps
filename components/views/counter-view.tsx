'use client';

import { redirect } from 'next/navigation';
import { CustomAlertDialog } from '../custom-alert-dialog';
import { Counter } from '../counter/counter';
import { useAuth } from '@clerk/nextjs';
import { LoadingView } from '../loading-view';

export function CounterView() {
  const { isLoaded, userId, orgId } = useAuth();

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

  if (!isLoaded) {
    return <LoadingView />;
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <Counter orgId={orgId} />
      </div>
    </>
  );
}
