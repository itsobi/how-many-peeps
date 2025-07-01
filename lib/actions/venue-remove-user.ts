'use server';

import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '../clerk-client';
import { isClerkAPIResponseError } from '@clerk/clerk-js';
import { adminCheck } from '../helpers';

export const removeUserFromVenue = async ({
  venueId,
  userId,
}: {
  venueId: string | null | undefined;
  userId: string | null | undefined;
}) => {
  await auth.protect();

  if (!venueId || !userId) {
    return {
      success: false,
      message: 'Venue ID or User ID is required',
    };
  }
  const { success, message } = await adminCheck();

  if (!success) {
    return {
      success,
      message,
    };
  }

  try {
    await clerkClient.organizations.deleteOrganizationMembership({
      organizationId: venueId,
      userId: userId,
    });
    return {
      success: true,
      message:
        'User removed from organization. You may need to refresh the page for the table to reflect changes.',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: isClerkAPIResponseError(error)
        ? error.errors[0].longMessage
        : 'There was an error remove this user from the organization',
    };
  }
};
