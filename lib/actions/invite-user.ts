'use server';

import { clerkClient } from '../clerk-client';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import { roleEnum } from '../types';
import { adminCheck } from '../helpers';

export const inviteUser = async ({
  email,
  orgId,
}: {
  email: string;
  orgId: string;
}) => {
  const { success, message } = await adminCheck();

  if (!success) {
    return {
      success,
      message,
    };
  }

  const organizationMembers =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: orgId,
      emailAddress: [email],
    });

  if (organizationMembers.totalCount > 0) {
    return {
      success: false,
      message: 'Sorry, this user is already a member of this organization',
    };
  }
  try {
    await clerkClient.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: email,
      role: roleEnum.MEMBER,
    });
    return {
      success: true,
      message: `Invitation sent to ${email}`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: isClerkAPIResponseError(error)
        ? error.errors[0].longMessage
        : 'Unable to send invitation',
    };
  }
};
