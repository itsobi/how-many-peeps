import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { CustomAlertDialog } from '../custom-alert-dialog';
import { preloadQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { Counter } from '../counter/counter';
import Link from 'next/link';

export async function CounterView() {
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
      <div className="flex justify-center items-center">
        <Counter
          preloadedCrowdCount={preloadedCrowdCount}
          preloadedGroupSize={preloadedGroupSize}
        />
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
