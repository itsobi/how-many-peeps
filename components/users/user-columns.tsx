'use client';

import { User } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { ActionsDropdown } from './actions-dropdown';

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: 'Name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <img
            src={row.original.image}
            alt={`${row.original.firstName} ${row.original.lastName}`}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="truncate">{`${row.original.firstName} ${row.original.lastName}`}</span>
            <span className="text-muted-foreground text-xs">
              {row.original.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.role}</span>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => {
      return <span>{row.original.createdAt.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return <ActionsDropdown />;
    },
  },
];
