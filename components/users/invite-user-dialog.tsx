'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { UserPlus2 } from 'lucide-react';
import { Input } from '../ui/input';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { toast } from 'sonner';
import { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { OrgInvitationsParams } from '@/lib/types';

import { inviteUser } from '@/lib/actions/invite-user';

export const addUserSchema = z.object({
  email: z.string().email(),
});

export function InviteUserDialog() {
  const { isLoaded, organization, invitations } =
    useOrganization(OrgInvitationsParams);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof addUserSchema>>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof addUserSchema>) => {
    if (!isLoaded || !organization) {
      return;
    }

    if (invitations?.data?.length && invitations.data.length >= 5) {
      toast.error('You have reached the maximum number of invitations');
      return;
    }

    toast.promise(inviteUser({ email: values.email, orgId: organization.id }), {
      loading: 'Sending invitation...',
      success: (data) => {
        setOpen(false);
        form.reset();
        invitations?.revalidate?.();
        return data.message;
      },
      error: (error) => {
        return error.message;
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus2 />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User to Venue</DialogTitle>
          <DialogDescription>
            Invite a user to join your venue. They will receive an email with a
            link to join.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="example@email.com"
                      type="email"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Send Invite
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
