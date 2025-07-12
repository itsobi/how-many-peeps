'use client';

import { auth } from '@clerk/nextjs/server';
import { redirect, useRouter } from 'next/navigation';
import { Header } from '../header/header';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

export function HeaderView() {
  // const { userId,  } = await auth();
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  if (!userId && isLoaded) {
    useEffect(() => {
      router.replace('/sign-in');
    }, []);
  }
  return <Header />;
}
