import { LoadingView } from '@/components/loading-view';
import { PageHeading } from '@/components/page-heading';
import { UsersView } from '@/components/views/users-view';
import { Suspense } from 'react';

export default function UsersPage() {
  return (
    <>
      <PageHeading title="Users" description="Manage your users" />
      <Suspense fallback={<LoadingView />}>
        <UsersView />
      </Suspense>
    </>
  );
}
