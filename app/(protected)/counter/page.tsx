import { LoadingView } from '@/components/loading-view';
import { PageHeading } from '@/components/page-heading';
import { Suspense } from 'react';

import { CounterView } from '@/components/views/counter-view';

export default function CounterPage() {
  return (
    <>
      <PageHeading
        title="Counter"
        description="Live counter to show the number of patrons in your venue. This will update the live count in real-time!"
        bottomMargin
      />
      <Suspense fallback={<LoadingView />}>
        <CounterView />
      </Suspense>
    </>
  );
}
