'use client';

import { Invitation } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { ActionsDropdown } from '../users/actions-dropdown';

export const invitationColumns: ColumnDef<Invitation>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <div className="capitalize">{row.original.status}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => <div className="text-center">Created At</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.createdAt.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: () => <div className="hidden">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <ActionsDropdown invitations={true} row={row.original} />
        </div>
      );
    },
  },
];
