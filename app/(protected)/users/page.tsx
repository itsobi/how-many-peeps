import { PageHeading } from '@/components/page-heading';
import { UsersView } from '@/components/views/users-view';

export default function UsersPage() {
  return (
    <>
      <PageHeading title="Users" description="Manage your users" />
      <UsersView />
    </>
  );
}
