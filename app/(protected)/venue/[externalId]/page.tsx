import { api } from '@/convex/_generated/api';
import { preloadQuery } from 'convex/nextjs';
import { VenueWrapper } from '@/components/venue/venue-wrapper';
import { CustomAlertDialog } from '@/components/custom-alert-dialog';

interface Props {
  params: Promise<{ externalId: string }>;
}

export default async function VenuePage({ params }: Props) {
  const { externalId } = await params;

  const preloadedVenue = await preloadQuery(api.venues.getVenue, {
    externalVenueId: externalId,
  });

  if (preloadedVenue._valueJSON === null) {
    return (
      <CustomAlertDialog
        title="Venue does not exists"
        description="This venue does not exist. You will be redirected to the home page."
        href="/home"
      />
    );
  }

  return (
    <>
      <VenueWrapper preloadedVenue={preloadedVenue} />
    </>
  );
}
