'use server';

import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '../clerk-client';
import { isClerkAPIResponseError } from '@clerk/clerk-js';
import { revalidatePath } from 'next/cache';
import { roleEnum } from '../types';
import { adminCheck } from '../helpers';

export const revokeInvitation = async ({
  orgId,
  invitationId,
  requestingUserId,
}: {
  orgId: string | null | undefined;
  invitationId: string | null | undefined;
  requestingUserId: string | null | undefined;
}) => {
  await auth.protect();

  if (!orgId || !invitationId || !requestingUserId) {
    return {
      success: false,
      message: 'Invalid request',
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
    await clerkClient.organizations.revokeOrganizationInvitation({
      organizationId: orgId,
      invitationId: invitationId,
      requestingUserId: requestingUserId,
    });
    revalidatePath('/users');
    return {
      success: true,
      message: 'Invitation revoked',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: isClerkAPIResponseError(error)
        ? error.errors[0].longMessage
        : 'Failed to revoke invitation',
    };
  }
};
