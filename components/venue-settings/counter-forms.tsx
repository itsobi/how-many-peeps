'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { roleEnum } from '@/lib/types';
import { groupSizeSchema, timeTrackingSchema } from '@/lib/form-schemas';

export function GroupSizeForm() {
  const { orgId, orgRole } = useAuth();
  const form = useForm<z.infer<typeof groupSizeSchema>>({
    resolver: zodResolver(groupSizeSchema),
    defaultValues: {
      groupSize: '',
    },
  });

  const data = useQuery(api.crowdCounts.getCrowdCountAndGroupSize, {
    venueId: orgId || '',
  });

  const venue = useQuery(api.venues.getVenue, {
    externalVenueId: orgId || '',
  });

  useEffect(() => {
    if (orgId) {
      form.setValue('groupSize', data?.groupSize?.toString() || '');
    }
  }, [orgId, data]);

  const updateGroupSize = useMutation(api.crowdCounts.updateGroupSize);

  const onSubmit = (values: z.infer<typeof groupSizeSchema>) => {
    if (Number(values.groupSize) === data?.groupSize) {
      toast.error('The group size is the same as the current group size');
      return;
    }

    if (!orgId) {
      toast.error('You must be in an organization to update the group size');
      return;
    }

    if (orgRole !== roleEnum.ADMIN) {
      toast.error('You must be an admin to update the group size');
      return;
    }

    if (Number(values.groupSize) !== data?.crowdCount) {
      updateGroupSize({
        groupSize: Number(values.groupSize),
        externalOrgId: orgId || '',
        timezone: venue?.timezone || 'America/New_York',
      });
    }

    toast.success('Counter settings updated');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="groupSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Size</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter group size"
                  min="0"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the number you want to set as the group size for your
                venue.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          {form.formState.isSubmitting ? 'Updating...' : 'Update Group Size'}
        </Button>
      </form>
    </Form>
  );
}

export function TimeTrackingForm() {
  const { orgId, orgRole } = useAuth();
  const form = useForm<z.infer<typeof timeTrackingSchema>>({
    resolver: zodResolver(timeTrackingSchema),
    defaultValues: {
      trackingTime: '',
    },
  });

  const venue = useQuery(api.venues.getVenue, {
    externalVenueId: orgId || '',
  });

  useEffect(() => {
    if (orgId) {
      form.setValue('trackingTime', venue?.trackingTime || '');
    }
  }, [orgId, venue]);

  const updateVenue = useMutation(api.venues.updateVenue);

  const onSubmit = (values: z.infer<typeof timeTrackingSchema>) => {
    if (!orgId) {
      toast.error('You must be in an organization to update the time tracking');
      return;
    }

    if (orgRole !== roleEnum.ADMIN) {
      toast.error('You must be an admin to update the time tracking');
      return;
    }

    if (values.trackingTime === venue?.trackingTime) {
      toast.error('The time tracking is the same as the current time tracking');
      return;
    }

    if (values.trackingTime !== venue?.trackingTime) {
      updateVenue({
        externalOrgId: orgId || '',
        trackingTime: values.trackingTime,
      });
    }

    toast.success('Time tracking updated');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="trackingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tracking Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  placeholder="Enter group size"
                  {...field}
                  className="w-fit"
                />
              </FormControl>
              <FormDescription>
                The counter will continue tracking people coming into the venue
                up until this time for that day (e.g., 2:00 AM). Once the time
                is reached, the counter will reset.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          {form.formState.isSubmitting ? 'Updating...' : 'Update Time Tracking'}
        </Button>
      </form>
    </Form>
  );
}
