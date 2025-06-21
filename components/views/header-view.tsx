import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Header } from '../header/header';

export async function HeaderView() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/sign-in');
  }
  return <Header />;
}
