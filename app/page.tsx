import ThemeToggle from '@/components/header/theme-toggle';
import Logo from '@/components/logo';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    return redirect('/home');
  }
  return (
    <div className="h-screen overflow-y-auto">
      <header className="p-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>
      <main className="px-4 md:px-0 container mx-auto">
        <div className="flex flex-col items-center gap-8 pt-20">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">How Many Peeps?</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Track venue occupancy in real-time. Manage users, and make
              data-driven decisions. Tailored for you and your venue!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/home"
              className={buttonVariants({ variant: 'outline' })}
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-20">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Tracking</CardTitle>
              <CardDescription>
                Monitor your venue's occupancy in real-time with accurate,
                up-to-the-minute data.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real-time Tracking</CardTitle>
              <CardDescription>
                Monitor your venue's occupancy in real-time with accurate,
                up-to-the-minute data.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real-time Tracking</CardTitle>
              <CardDescription>
                Monitor your venue's occupancy in real-time with accurate,
                up-to-the-minute data.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real-time Tracking</CardTitle>
              <CardDescription>
                Monitor your venue's occupancy in real-time with accurate,
                up-to-the-minute data.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
