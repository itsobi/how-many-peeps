import { PageHeading } from '@/components/page-heading';
import { Label } from '@/components/ui/label';
import { ManualCounter } from '@/components/counter/manual-counter';

export default function ManualCounterPage() {
  return (
    <>
      <PageHeading
        title="Manual Counter"
        description="Manually add your venue count."
      />
      <div className="flex justify-center items-center mt-40">
        <ManualCounter />
      </div>
    </>
  );
}
