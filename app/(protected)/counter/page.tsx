import { PageHeading } from '@/components/page-heading';

import { CounterView } from '@/components/views/counter-view';

export default function CounterPage() {
  return (
    <>
      <PageHeading
        title="Counter"
        description="Live counter to show the number of patrons in your venue. This will update the live count in real-time!"
        bottomMargin
      />

      <CounterView />
    </>
  );
}
