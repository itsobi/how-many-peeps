'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { clerkClient } from '../clerk-client';
import { createVenueFormSchema } from '../form-schemas';
import { isClerkAPIResponseError } from '@clerk/clerk-js';

export const createVenue = async (
  values: z.infer<typeof createVenueFormSchema>
) => {
  const { userId } = await auth();

  if (!userId) throw new Error('Unauthorized');

  const formValues = createVenueFormSchema.safeParse(values);

  if (!formValues.success) throw new Error('Invalid form values');

  try {
    const newVenue = await clerkClient.organizations.createOrganization({
      name: values.name,
      createdBy: userId,
    });
    return {
      success: true,
      message: 'Venue created successfully',
      venueId: newVenue.id,
      venueName: newVenue.name,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: isClerkAPIResponseError(error)
        ? error.errors[0].longMessage
        : 'Failed to create organization',
    };
  }
};
