import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    return redirect('/home');
  }
  return <div>Landing Page</div>;
}
