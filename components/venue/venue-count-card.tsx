import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Eye, UsersRound } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import Link from 'next/link';
import { Venue } from '@/lib/types';

export function VenueCountCard({ venue }: { venue: Venue }) {
  const orgLocation =
    venue.city && venue.state ? `${venue.city}, ${venue.state}` : '';
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{venue.name}</CardTitle>
        <CardDescription className="capitalize">{orgLocation}</CardDescription>
        <CardAction>
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex justify-center gap-1">
        <p className="text-6xl lg:text-4xl font-semibold">{venue.crowdCount}</p>
        <UsersRound className="flex self-end" />
      </CardContent>
      <CardFooter>
        <Link
          href={`/venue/${venue.externalId}`}
          className={buttonVariants({
            variant: 'outline',
            className: 'w-full lg:hidden ',
          })}
        >
          Visit venue
        </Link>
        <div className="hidden absolute bottom-4 right-4 lg:flex ">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/venue/${venue.externalId}`}
                className={buttonVariants({
                  variant: 'ghost',
                  className: 'hidden lg:flex w-full',
                })}
              >
                <Eye />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visit venue</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
}
