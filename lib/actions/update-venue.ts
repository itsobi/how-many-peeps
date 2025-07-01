'use server';

import { clerkClient } from '../clerk-client';
import { adminCheck } from '../helpers';

export const updateVenue = async ({
  organizationId,
  name,
}: {
  organizationId: string;
  name: string;
}) => {
  const { success, message } = await adminCheck();

  if (!success) {
    return {
      success,
      message,
    };
  }

  try {
    await clerkClient.organizations.updateOrganization(organizationId, {
      name,
    });

    return {
      success: true,
      message: 'Venue updated successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to update venue',
    };
  }
};
