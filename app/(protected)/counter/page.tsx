import { Counter } from '@/components/counter/counter';
import { PageHeading } from '@/components/page-heading';

export default function CounterPage() {
  return (
    <>
      <PageHeading
        title="Counter"
        description="Live counter to show the number of patrons in your venue. This will update the live count in real-time!"
      />

      <div className="flex justify-center items-center">
        <div className="mt-10">
          <Counter />
        </div>
      </div>
    </>
  );
}
