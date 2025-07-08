import { PageHeading } from '@/components/page-heading';
import { UsersView } from '@/components/views/users-view';

export default function UsersPage() {
  return (
    <>
      <PageHeading
        title="Users"
        description="Manage users within your venue."
      />
      <UsersView />
    </>
  );
}
