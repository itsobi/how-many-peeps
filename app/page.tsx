'use client';

import { motion } from 'motion/react';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Activity, ChartLine, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { PublicHeader } from '@/components/auth/public-header';
import { useEffect } from 'react';

const features = [
  {
    title: 'Real-time',
    description:
      'Instantly see how many people are in your venue at any given time, allowing you or anyone around the world make decisions based on real-time data.',
    icon: <Activity />,
  },
  {
    title: 'Manage Users',
    description:
      'Control who has access to your venue. Invite, remove and revoke access based on what you need.',
    icon: <Users />,
  },
  {
    title: 'Data-driven decisions',
    description:
      'Gain insights from historical data to help you make data-driven decisions.',
    icon: <ChartLine />,
  },
];

export default function Home() {
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      router.push('/home');
    }
  }, [userId, router]);

  return (
    <div className="h-screen overflow-y-auto">
      <PublicHeader />
      <main className="px-4 md:px-0 container mx-auto">
        <div className="flex flex-col items-center gap-8 pt-20">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-wide">
              How Many Peeps?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl tracking-wide">
              Track venue occupancy in real-time. Manage users, and make
              data-driven decisions. Tailored for you and your venue!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/home"
              className={buttonVariants({ variant: 'default' })}
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {feature.title}{' '}
                    <span className="text-primary">{feature.icon}</span>
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
