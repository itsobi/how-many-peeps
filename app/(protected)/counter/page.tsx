import { Counter } from '@/components/counter/counter';
import { Loading } from '@/components/loading';
import { PageHeading } from '@/components/page-heading';
import { Suspense } from 'react';

export default function CounterPage() {
  return (
    <>
      <PageHeading
        title="Counter"
        description="Live counter to show the number of patrons in your venue. This will update the live count in real-time!"
      />

      <div className="flex justify-center items-center">
        <div className="mt-10">
          <Suspense fallback={<Loading />}>
            <Counter />
          </Suspense>
        </div>
      </div>
    </>
  );
}
