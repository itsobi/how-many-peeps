'use client';

import { useQuery } from 'convex/react';

import { UserMinus, UserPlus } from 'lucide-react';
import { useTransition } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import Link from 'next/link';

interface Props {
  orgId: string;
}

export function Counter({ orgId }: Props) {
  const venue = useQuery(api.venues.getVenue, {
    externalVenueId: orgId,
  });
  const data = useQuery(api.crowdCounts.getCrowdCountAndGroupSize, {
    venueId: orgId,
  });

  const [updateCrowdCountIsPending, startCrowdCountTransition] =
    useTransition();
  const [updateGroupSizeIsPending, startGroupSizeTransition] = useTransition();

  const updateOrgCrowdCount = useMutation(api.crowdCounts.updateCrowdCount);

  const handleUpdateCrowdCount = (count: number) => {
    if (!orgId) {
      toast.error('Unable to update crowd count org id is not set');
      return;
    }
    startCrowdCountTransition(async () => {
      const response = await updateOrgCrowdCount({
        venueId: orgId,
        timezone: venue?.timezone ?? 'America/New_York',
        count,
      });
      if (!response.success) {
        toast.error(response.message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 items-center w-[300px]">
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </div>
        </div>
        <p className="text-sm">LIVE COUNT</p>
      </div>

      <h2 className="text-9xl font-semibold">{data?.crowdCount ?? 0}</h2>

      {/* Controls */}
      <div className="flex flex-col w-full gap-4 text-sm text-muted-foreground">
        {/* Confirm button */}

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => {
              if (!data?.crowdCount || data?.crowdCount === 0) {
                return;
              }
              handleUpdateCrowdCount(data?.crowdCount - 1);
            }}
            disabled={
              !data?.crowdCount ||
              data.crowdCount === 0 ||
              updateCrowdCountIsPending
            }
            className="cursor-pointer rounded p-6 w-full flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground"
          >
            <UserMinus className="w-6 h-6" />
            Exit
          </button>
          <button
            onClick={() => handleUpdateCrowdCount((data?.crowdCount ?? 0) + 1)}
            disabled={updateCrowdCountIsPending}
            className="cursor-pointer rounded p-6 w-full flex flex-col items-center gap-2 hover:bg-green-500 hover:text-white transition-colors duration-300 ease-in-out shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground"
          >
            <UserPlus className="w-6 h-6" />
            Enter
          </button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() =>
              handleUpdateCrowdCount(
                (data?.crowdCount ?? 0) - (data?.groupSize ?? 0)
              )
            }
            disabled={
              !data?.groupSize ||
              data?.groupSize === 0 ||
              data?.crowdCount === 0 ||
              updateGroupSizeIsPending
            }
            className="cursor-pointer rounded p-6 w-full flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white transition-colors duration-300 ease-in-out shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground"
          >
            <span className="text-lg">-{data?.groupSize ?? 0}</span>
            <span>Group Exit</span>
          </button>
          <button
            onClick={() =>
              handleUpdateCrowdCount(
                (data?.crowdCount ?? 0) + (data?.groupSize ?? 0)
              )
            }
            disabled={
              !data?.groupSize ||
              data?.groupSize === 0 ||
              updateGroupSizeIsPending
            }
            className="cursor-pointer rounded p-6 w-full flex flex-col items-center gap-2 hover:bg-green-500 hover:text-white transition-colors duration-300 ease-in-out shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-muted-foreground"
          >
            <span className="text-lg">+{data?.groupSize ?? 0}</span>
            <span>Group Enter</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center py-8 text-center">
        <p className="text-xs text-muted-foreground">
          For any issues regarding the live counter, please visit{' '}
          <Link href="/counter/manual" className="text-primary hover:underline">
            here
          </Link>{' '}
          to update manually.
        </p>
      </div>
    </div>
  );
}
