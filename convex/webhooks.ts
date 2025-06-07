import { WebhookEvent } from '@clerk/nextjs/server';
import { httpAction } from './_generated/server';
import { Webhook } from 'svix';
import { internal } from './_generated/api';
import { NextRequest } from 'next/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

export const handleClerkWebhook = httpAction(async (ctx, request) => {
  console.log('HANDLING CLERK WEBHOOK');
  const payload = await request.text();

  // Log headers for debugging
  console.log(
    'Received Headers:',
    Object.fromEntries(request.headers.entries())
  );

  const svixHeaders = {
    'svix-id': request.headers.get('svix-id')!,
    'svix-timestamp': request.headers.get('svix-timestamp')!,
    'svix-signature': request.headers.get('svix-signature')!,
  };

  // Log Svix headers specifically
  console.log('Svix Headers:', svixHeaders);

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

  console.log('Received Payload:', payload);

  try {
    event = wh.verify(payload, svixHeaders) as WebhookEvent;
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return new Response('Invalid webhook signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'user.created':
        console.log('Processing user.created event:', event.data);
        await ctx.runMutation(internal.users.createUser, {
          externalId: event.data.id,
          firstName: event.data.first_name ?? undefined,
          lastName: event.data.last_name ?? undefined,
          email: event.data.email_addresses[0].email_address,
          imageUrl: event.data.image_url,
          role: 'user',
        });
        break;
      case 'user.updated':
        console.log('Processing user.updated event:', event.data);
        await ctx.runMutation(internal.users.updateUser, {
          externalId: event.data.id,
          firstName: event.data.first_name ?? undefined,
          lastName: event.data.last_name ?? undefined,
        });
        break;
      case 'user.deleted':
        console.log('Processing user.deleted event:', event.data);
        if (!event.data.id) {
          console.error('User ID missing in delete event');
          return new Response('User does not exist', { status: 404 });
        }
        await ctx.runMutation(internal.users.deleteUser, {
          externalId: event.data.id,
        });
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
