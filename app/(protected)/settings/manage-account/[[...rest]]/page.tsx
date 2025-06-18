'use client';

import { PageHeading } from '@/components/page-heading';
import { UserProfile } from '@clerk/nextjs';

import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export default function ManageAccountPage() {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <PageHeading
        title="Manage Account"
        description="Manage your account"
        bottomMargin
      />
      <div className="flex justify-center items-center">
        <UserProfile
          appearance={{
            baseTheme: resolvedTheme === 'dark' ? dark : undefined,
          }}
        />
      </div>
    </>
  );
}
