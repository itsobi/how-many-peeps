'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { roleEnum } from '@/lib/types';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect } from 'react';

const formSchema = z.object({
  count: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    },
    {
      message: 'Count must be a number greater than 0',
    }
  ),
});

export function ManualCounter() {
  const { orgId, orgRole } = useAuth();
  const form = useForm<{ count: string }>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      count: '',
    },
  });
  const venueCount = useQuery(api.crowdCounts.getCrowdCount, {
    venueId: orgId || '',
  });

  console.log(venueCount);

  useEffect(() => {
    if (orgId) {
      form.setValue('count', venueCount?.count?.toString() || '');
    }
  }, [orgId, venueCount]);

  const updateCrowdCount = useMutation(api.crowdCounts.updateCrowdCount);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (Number(values.count) === venueCount?.count) {
      toast.error('The count is the same as the current count');
      return;
    }

    if (!orgId) {
      toast.error('You must be in an organization to update the counter');
      return;
    }

    if (orgRole !== roleEnum.ADMIN) {
      toast.error('You must be an admin to update the counter');
      return;
    }

    updateCrowdCount({
      count: Number(values.count),
      venueId: orgId || '',
    });

    toast.success('Crowd count updated');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ''} // Handle undefined by setting empty string
                  onChange={(e) => field.onChange(e.target.value)} // Pass string to transform
                />
              </FormControl>
              <FormDescription>
                Enter the number of people currently in the venue.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || !form.formState.isDirty}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
