import { WebhookEvent } from '@clerk/nextjs/server';
import { httpAction } from './_generated/server';
import { Webhook } from 'svix';
import { internal } from './_generated/api';
import { organizationTypeEnum } from '@/lib/types';

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

export const handleClerkWebhook = httpAction(async (ctx, request) => {
  const payload = await request.text();

  const svixHeaders = {
    'svix-id': request.headers.get('svix-id')!,
    'svix-timestamp': request.headers.get('svix-timestamp')!,
    'svix-signature': request.headers.get('svix-signature')!,
  };

  if (
    !svixHeaders['svix-id'] ||
    !svixHeaders['svix-timestamp'] ||
    !svixHeaders['svix-signature']
  ) {
    console.error('Missing required Svix headers');
    return new Response('Missing Svix headers', { status: 400 });
  }

  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET environment variable is not set');
    return new Response('WEBHOOK_SECRET not defined', { status: 400 });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(payload, svixHeaders) as WebhookEvent;
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return new Response('Invalid webhook signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'user.created':
        await ctx.runMutation(internal.users.createUser, {
          externalId: event.data.id,
          firstName: event.data.first_name ?? undefined,
          lastName: event.data.last_name ?? undefined,
          email: event.data.email_addresses[0].email_address,
          imageUrl: event.data.image_url,
          canCreateVenue: false,
        });
        console.log('--USER CREATED--');
        break;
      case 'user.updated':
        await ctx.runMutation(internal.users.updateUser, {
          externalId: event.data.id,
          firstName: event.data.first_name ?? undefined,
          lastName: event.data.last_name ?? undefined,
        });
        console.log('--USER UPDATED--');
        break;
      case 'user.deleted':
        if (!event.data.id) {
          console.error('User ID missing in delete event');
          return new Response('User does not exist', { status: 404 });
        }
        await ctx.runMutation(internal.users.deleteUser, {
          externalId: event.data.id,
        });
        console.log('--USER DELETED--');
        break;
      case 'organization.created':
        await ctx.runMutation(internal.venues.createVenue, {
          externalId: event.data.id,
          name: event.data.name,
          imageUrl: event.data.image_url || '',
          timezone:
            (event.data?.public_metadata?.timezone as string) ||
            'America/New_York',
        });
        console.log('--ORGANIZATION CREATED--');
        break;
      case 'organization.updated':
        await ctx.runMutation(internal.venues.updateVenueInternalConvex, {
          externalId: event.data.id,
          name: event.data.name,
          imageUrl: event.data.image_url || '',
        });
        console.log('--ORGANIZATION UPDATED--');
        break;
      case 'organization.deleted':
        if (!event.data.id) {
          console.error('User ID missing in delete event');
          return new Response('User does not exist', { status: 404 });
        }
        await ctx.runMutation(internal.venues.deleteVenue, {
          externalId: event.data.id,
        });
        await ctx.runMutation(internal.crowdCounts.deleteCrowdCount, {
          externalOrgId: event.data.id,
        });
        console.log('--ORGANIZATION DELETED--');
        break;
      case 'organizationMembership.created':
        await ctx.runMutation(internal.venues.createVenueMembership, {
          venueExternalId: event.data.organization.id,
          userExternalId: event.data.public_user_data.user_id,
          role: event.data.role,
        });
        console.log('--ORGANIZATION MEMBERSHIP CREATED--');
        break;
      case 'organizationMembership.deleted':
        await ctx.runMutation(internal.venues.deleteVenueMembership, {
          venueExternalId: event.data.organization.id,
          userExternalId: event.data.public_user_data.user_id,
        });
        console.log('--ORGANIZATION MEMBERSHIP DELETED--');
        break;
      default:
        console.log('Unhandled event type:', event.type);
        break;
    }
    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Failed to process webhook', { status: 400 });
  }
});
