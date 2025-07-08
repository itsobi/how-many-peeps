'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { toast } from 'sonner';
import { SetStateAction, Dispatch } from 'react';
import { createVenueFormSchema } from '@/lib/form-schemas';
import { createVenue } from '@/lib/actions/create-venue';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { TIMEZONES } from '@/lib/constants';

export function CreateVenueForm({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const canCreateVenue = useQuery(api.users.canUserCreateVenue);
  const form = useForm<z.infer<typeof createVenueFormSchema>>({
    resolver: zodResolver(createVenueFormSchema),
    defaultValues: {
      name: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const onSubmit = async (values: z.infer<typeof createVenueFormSchema>) => {
    if (!canCreateVenue) {
      toast.error(
        'You are not authorized to create an venue. Please reach out to get this feature enabled.'
      );
      return;
    }

    const response = await createVenue(values);
    if (response.success) {
      form.reset();
      setOpen(false);
      toast.success(response.message);
      window.location.reload();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((timezone) => (
                      <SelectItem key={timezone.value} value={timezone.value}>
                        {timezone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Creating...' : 'Create Venue'}
        </Button>
      </form>
    </Form>
  );
}
