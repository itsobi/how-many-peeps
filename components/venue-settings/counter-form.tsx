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

const formSchema = z.object({
  groupSize: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    },
    {
      message: 'Count must be a number greater than 0',
    }
  ),
});

export function CounterForm() {
  const { orgId, orgRole } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupSize: '',
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (Number(values.groupSize) === crowdCount) {
      toast.error('The group size is the same as the current group size');
      return;
    }

    if (!orgId) {
      toast.error('You must be in an organization to update the group size');
      return;
    }

    if (orgRole === roleEnum.ADMIN) {
      toast.error('You must be an admin to update the group size');
      return;
    }

    updateGroupSize({
      groupSize: Number(values.groupSize),
      externalOrgId: orgId || '',
    });

    toast.success('Group size updated');
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
        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || orgRole !== roleEnum.ADMIN}
        >
          {form.formState.isSubmitting ? 'Updating...' : 'Update Group Size'}
        </Button>
      </form>
    </Form>
  );
}
