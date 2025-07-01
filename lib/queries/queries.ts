import 'server-only';

import { unstable_cache } from 'next/cache';
import { clerkClient } from '../clerk-client';

export const getOrganization = (orgId: string) => {
  return unstable_cache(
    async () => {
      if (!orgId) {
        throw new Error('Organization ID is required');
      }
      try {
        return await clerkClient.organizations.getOrganization({
          organizationId: orgId,
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    ['organization', orgId], // Cache key with orgId
    { revalidate: 60 } // Revalidate every 60 seconds
  )();
};
