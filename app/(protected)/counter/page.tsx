import { CustomAlertDialog } from '@/components/custom-alert-dialog';
import { Counter } from '@/components/counter/counter';
import { LoadingScreen } from '@/components/loading';
import { PageHeading } from '@/components/page-heading';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function CounterPage() {
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

  return (
    <>
      <PageHeading
        title="Counter"
        description="Live counter to show the number of patrons in your venue. This will update the live count in real-time!"
        bottomMargin
      />

      <div className="flex justify-center items-center">
        <Suspense fallback={<LoadingScreen />}>
          <Counter />
        </Suspense>
      </div>
    </>
  );
}
