'use client';

import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PageHeading } from '../page-heading';
import { Venue } from './venue';

interface Props {
  preloadedVenue: Preloaded<typeof api.venues.getVenue>;
}

export function VenueWrapper({ preloadedVenue }: Props) {
  const venue = usePreloadedQuery(preloadedVenue);

  return (
    <>
      <PageHeading
        title={venue?.name || '--'}
        description={venue?.description || ''}
        bottomMargin
      />
      <Venue preloadedVenue={preloadedVenue} />
    </>
  );
}
