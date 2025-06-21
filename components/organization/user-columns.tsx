'use client';

import { roleEnum, User } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { ActionsDropdown } from '../users/actions-dropdown';

export const userColumns: ColumnDef<User>[] = [
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
      const role = row.original.role === roleEnum.ADMIN ? 'Admin' : 'Member';
      return <span>{role}</span>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => <div className="text-center">Joined</div>,
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
          <ActionsDropdown row={row.original} />
        </div>
      );
    },
  },
];
