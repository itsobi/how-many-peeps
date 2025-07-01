'use client';

import { useQuery } from 'convex/react';
import { VenueCountCard } from '../venue/venue-count-card';
import { api } from '@/convex/_generated/api';
import { LoadingView } from '../loading-view';

export function HomeView() {
  const venues = useQuery(api.venues.getAllVenues);

  if (venues === undefined) {
    return <LoadingView />;
  }

  if (venues.length === 0) {
    return <p className="text-xs text-muted-foreground">No venues found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {venues?.map((venue) => (
        <VenueCountCard key={venue.externalId} venue={venue} />
      ))}
    </div>
  );
}
