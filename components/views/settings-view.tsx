'use client';

import { redirect } from 'next/navigation';
import { CustomAlertDialog } from '../custom-alert-dialog';
import { BasicInformationForm } from '../venue-settings/basic-information-form';
import { useAuth } from '@clerk/nextjs';
import { LoadingView } from '../loading-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { VenueHoursForm } from '../venue-settings/venue-hours-form';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  GroupSizeForm,
  TimeTrackingForm,
} from '../venue-settings/counter-forms';

export function SettingsView() {
  const { isLoaded, userId, orgId } = useAuth();

  const venue = useQuery(api.venues.getVenue, {
    externalVenueId: orgId ?? '',
  });

  if (!isLoaded) {
    return <LoadingView />;
  }

  if (isLoaded && !orgId) {
    if (!userId) {
      return redirect('/');
    }
    return (
      <CustomAlertDialog
        title="Unauthorized"
        description="You must be a member of an organization or set to your organization via the user button to access this page."
        href="/home"
      />
    );
  }

  return (
    <div className="border rounded p-4 shadow-sm md:w-2/3 md:mx-auto">
      <Tabs defaultValue="venue-info" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="venue-info">Venue Information</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="counter">Counter</TabsTrigger>
        </TabsList>
        <TabsContent value="venue-info">
          <BasicInformationForm venue={venue} />
        </TabsContent>
        <TabsContent value="hours">
          <VenueHoursForm hours={venue?.hours} />
        </TabsContent>
        <TabsContent value="counter">
          <div className="space-y-8">
            <GroupSizeForm />
            <TimeTrackingForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
