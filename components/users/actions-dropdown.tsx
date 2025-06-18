import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { EllipsisIcon, Shield, UserRoundX } from 'lucide-react';

export function ActionsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4" /> Set as admin
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="flex items-center gap-2">
            <UserRoundX className="w-4 h-4" /> Remove user from organization
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
