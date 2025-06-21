import 'server-only';

import { auth } from '@clerk/nextjs/server';

import { roleEnum } from './types';

export const adminCheck = async () => {
  const { orgRole } = await auth();

  if (orgRole !== roleEnum.ADMIN) {
    return {
      success: false,
      message: 'Unauthorized',
    };
  }

  return {
    success: true,
  };
};
