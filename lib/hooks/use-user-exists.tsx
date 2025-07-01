// lib/hooks/useUserExists.ts
'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function useUserExists(email: string) {
  // Use Convex's useQuery to check if the user exists
  const userExists = useQuery(api.users.doesUserExist, { email });

  // Handle loading and error states
  const isLoading = userExists === undefined;
  const error = userExists === null ? 'Failed to check user existence' : null;

  // Apply your custom logic for the specific email
  if (userExists || email === 'obi.j.obialo@gmail.com') {
    return true;
  }
  return false;
}
