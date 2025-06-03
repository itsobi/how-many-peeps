import { PageHeading } from '@/components/page-heading';
import { columns } from '@/components/users/columns';
import { DataTable } from '@/components/users/data-table';
import { users } from '@/lib/types';

export default function UsersPage() {
  return (
    <>
      <PageHeading title="Users" description="Manage your users" />
      <div className="mt-4">
        <DataTable columns={columns} data={users} />
      </div>
    </>
  );
}
