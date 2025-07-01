'use server';

import { auth } from '@clerk/nextjs/server';
import { roleEnum } from '../types';
import { clerkClient } from '../clerk-client';
import { adminCheck } from '../helpers';

export const updateOrgMembership = async ({
  organizationId,
  userId,
  role,
}: {
  organizationId: string | null | undefined;
  userId: string | null | undefined;
  role: roleEnum;
}) => {
  await auth.protect();

  if (!organizationId || !userId) {
    return {
      success: false,
      message: 'Organization ID or User ID is required',
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
    await clerkClient.organizations.updateOrganizationMembership({
      organizationId,
      userId,
      role,
    });
    return {
      success: true,
      message:
        'Role updated successfully. You may need to refresh the page for the table to reflect changes.',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'There was an error updating the role',
    };
  }
};
