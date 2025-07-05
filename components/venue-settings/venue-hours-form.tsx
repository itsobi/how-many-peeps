'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Clock } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { operatingHoursSchema } from '@/lib/form-schemas';
import { Button } from '../ui/button';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { roleEnum } from '@/lib/types';
import { useEffect } from 'react';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

const shortDayMap = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

type DayKey = Lowercase<(typeof daysOfWeek)[number]>;

interface Props {
  hours: any;
}

export function VenueHoursForm({ hours }: Props) {
  const { isLoaded, orgId, orgRole } = useAuth();
  const form = useForm<z.infer<typeof operatingHoursSchema>>({
    resolver: zodResolver(operatingHoursSchema),
    defaultValues: {
      monday: {
        closed: hours?.monday?.closed || false,
        open: hours?.monday?.open || '09:00',
        close: hours?.monday?.close || '17:00',
      },
      tuesday: {
        closed: hours?.tuesday?.closed || false,
        open: hours?.tuesday?.open || '09:00',
        close: hours?.tuesday?.close || '17:00',
      },
      wednesday: {
        closed: hours?.wednesday?.closed || false,
        open: hours?.wednesday?.open || '09:00',
        close: hours?.wednesday?.close || '17:00',
      },
      thursday: {
        closed: hours?.thursday?.closed || false,
        open: hours?.thursday?.open || '09:00',
        close: hours?.thursday?.close || '17:00',
      },
      friday: {
        closed: hours?.friday?.closed || false,
        open: hours?.friday?.open || '09:00',
        close: hours?.friday?.close || '17:00',
      },
      saturday: {
        closed: hours?.saturday?.closed || false,
        open: hours?.saturday?.open || '09:00',
        close: hours?.saturday?.close || '17:00',
      },
      sunday: {
        closed: hours?.sunday?.closed || false,
        open: hours?.sunday?.open || '09:00',
        close: hours?.sunday?.close || '17:00',
      },
    },
  });

  useEffect(() => {
    if (hours) {
      form.reset(hours);
    }
  }, [hours, form]);

  const updateVenueHours = useMutation(api.venues.updateVenue);

  const onSubmit = async (values: z.infer<typeof operatingHoursSchema>) => {
    if (!isLoaded || !orgId) {
      toast.error('Not loaded or orgId not found');
      return;
    }

    if (orgRole !== roleEnum.ADMIN) {
      toast.error('You are not authorized to update operating hours');
      return;
    }

    const res = await updateVenueHours({
      externalId: orgId,
      hours: values,
    });

    if (res.success) {
      toast.success(res.message);
      // Reset form with the new values as the new default
      form.reset(values);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Clock className="w-6 h-6" />
        <h2 className="text-lg font-semibold">Operating Hours</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {daysOfWeek.map((day) => {
            const dayKey = day.toLowerCase() as DayKey;
            return (
              <div
                key={day}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="w-10">
                  <p className="font-medium">{shortDayMap[dayKey]}</p>
                </div>

                <FormField
                  control={form.control}
                  name={`${dayKey}.closed`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Closed</FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`${dayKey}.open`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="time"
                            className="w-[100px] text-center"
                            disabled={form.watch(`${dayKey}.closed`)}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span className="text-muted-foreground">-</span>
                  <FormField
                    control={form.control}
                    name={`${dayKey}.close`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="time"
                            className="w-[100px] text-center"
                            disabled={form.watch(`${dayKey}.closed`)}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            );
          })}

          <Button
            type="submit"
            className="w-full"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? 'Updating...'
              : 'Update Operating Hours'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
