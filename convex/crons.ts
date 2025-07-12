import { cronJobs } from 'convex/server';
import { api, internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
  'Reset all venue counters at midnight',
  { minutes: 10 },
  api.crowdCounts.resetAllVenueCounters
);

export default crons;
