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
import { useEffect } from 'react';
import { toast } from 'sonner';
import { roleEnum } from '@/lib/types';
import { Switch } from '../ui/switch';

const formSchema = z
  .object({
    groupSize: z.string().optional(),
    enableTimeTracking: z.boolean(),
    trackingTime: z.string().optional(),
  })
  .refine(
    (data) => {
      // At least one of groupSize or trackingTime must be provided
      const hasGroupSize = data.groupSize && data.groupSize.trim() !== '';
      const hasTrackingTime =
        data.trackingTime && data.trackingTime.trim() !== '';

      if (!hasGroupSize && !hasTrackingTime) {
        return false;
      }

      // If groupSize is provided, it must be a valid number > 0
      if (hasGroupSize) {
        const num = Number(data.groupSize);
        if (isNaN(num) || num <= 0) {
          return false;
        }
      }

      // If time tracking is enabled, trackingTime must be a valid time
      if (data.enableTimeTracking) {
        return (
          data.trackingTime &&
          data.trackingTime.trim() !== '' &&
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.trackingTime)
        );
      }

      return true;
    },
    {
      message:
        'Either group size must be a valid number greater than 0, or a valid tracking time must be provided when time tracking is enabled',
    }
  );

export function CounterForm({
  trackingTime,
}: {
  trackingTime: string | undefined;
}) {
  const { orgId, orgRole } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupSize: '',
      enableTimeTracking: false,
      trackingTime: trackingTime || '',
    },
  });

  const crowdCount = useQuery(api.crowdCounts.getGroupSize, {
    venueId: orgId || '',
  });

  useEffect(() => {
    if (orgId) {
      form.setValue('groupSize', crowdCount?.toString() || '');
    }
  }, [orgId, crowdCount]);

  const updateGroupSize = useMutation(api.crowdCounts.updateGroupSize);
  const updateVenue = useMutation(api.venues.updateVenue);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (Number(values.groupSize) === crowdCount) {
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

    if (Number(values.groupSize) === crowdCount) {
      toast.error('The group size is the same as the current group size');
      return;
    }

    if (values.trackingTime === trackingTime) {
      toast.error('The tracking time is the same as the current tracking time');
      return;
    }

    if (Number(values.groupSize) !== crowdCount) {
      updateGroupSize({
        groupSize: Number(values.groupSize),
        externalOrgId: orgId || '',
      });
    }

    if (values.enableTimeTracking) {
      updateVenue({
        externalOrgId: orgId || '',
        trackingTime: values.trackingTime,
      });
    }

    toast.success('Counter settings updated');
  };

  const watchTimeTracking = form.watch('enableTimeTracking');

  const isAdmin = orgRole === roleEnum.ADMIN;

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
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
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

        <FormField
          control={form.control}
          name="enableTimeTracking"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Time-based Tracking</FormLabel>
                <FormDescription>
                  Continue tracking people coming into the venue after midnight
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {watchTimeTracking && (
          <FormField
            control={form.control}
            name="trackingTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tracking Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    placeholder="Select time"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-fit"
                  />
                </FormControl>
                <FormDescription>
                  The counter will continue tracking people coming into the
                  venue up until this time for that day (e.g., 2:00 AM). Once
                  the time is reached, the counter will reset.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={
            !isAdmin || form.formState.isSubmitting || !form.formState.isValid
          }
        >
          {form.formState.isSubmitting
            ? 'Updating...'
            : 'Update Counter Settings'}
        </Button>
      </form>
    </Form>
  );
}
