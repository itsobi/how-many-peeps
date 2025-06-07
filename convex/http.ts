import { httpRouter } from 'convex/server';
import { handleClerkWebhook } from './webhooks';

const http = httpRouter();

http.route({
  path: '/api/webhooks/clerk',
  method: 'POST',
  handler: handleClerkWebhook,
});

export default http;
