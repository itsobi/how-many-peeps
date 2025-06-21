import { CustomAlertDialog } from '@/components/custom-alert-dialog';
import { Counter } from '@/components/counter/counter';
import { LoadingView } from '@/components/loading-view';
import { PageHeading } from '@/components/page-heading';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';

export default async function CounterPage() {
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

  const preloadedCrowdCount = await preloadQuery(
    api.crowdCounts.getCrowdCount,
    {
      externalOrgId: orgId,
    }
  );

  const preloadedGroupSize = await preloadQuery(api.crowdCounts.getGroupSize, {
    externalOrgId: orgId,
  });

  return (
    <>
      <PageHeading
        title="Counter"
        description="Live counter to show the number of patrons in your venue. This will update the live count in real-time!"
        bottomMargin
      />

      <div className="flex justify-center items-center">
        <Suspense fallback={<LoadingView />}>
          <Counter
            preloadedCrowdCount={preloadedCrowdCount}
            preloadedGroupSize={preloadedGroupSize}
          />
        </Suspense>
      </div>

      <div className="flex justify-center py-8 text-center">
        <p className="text-xs text-muted-foreground">
          For any issues regarding the live counter, please visit{' '}
          <Link
            href="/counter/manual"
            className="text-cyan-700 hover:underline"
          >
            here
          </Link>{' '}
          to update manually.
        </p>
      </div>
    </>
  );
}
