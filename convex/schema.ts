import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const usersTable = defineTable({
  externalId: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  email: v.string(),
  imageUrl: v.string(),
  canCreateVenue: v.boolean(),
})
  .index('by_external_id', ['externalId'])
  .index('by_email', ['email']);

const venuesTable = defineTable({
  externalId: v.string(),
  name: v.string(),
  members: v.optional(
    v.record(
      v.string(),
      v.object({
        role: v.string(),
      })
    )
  ),
  imageUrl: v.string(),
  timezone: v.string(),
  city: v.optional(v.string()),
  state: v.optional(v.string()),
  type: v.optional(v.string()),
  address: v.optional(v.string()),
  description: v.optional(v.string()),
  website: v.optional(v.string()),
  established: v.optional(v.string()),
  trackingTime: v.optional(v.string()),
  hours: v.optional(
    v.object({
      monday: v.object({
        closed: v.boolean(),
        open: v.string(),
        close: v.string(),
      }),
      tuesday: v.object({
        closed: v.boolean(),
        open: v.string(),
        close: v.string(),
      }),
      wednesday: v.object({
        closed: v.boolean(),
        open: v.string(),
        close: v.string(),
      }),
      thursday: v.object({
        closed: v.boolean(),
        open: v.string(),
        close: v.string(),
      }),
      friday: v.object({
        closed: v.boolean(),
        open: v.string(),
        close: v.string(),
      }),
      saturday: v.object({
        closed: v.boolean(),
        open: v.string(),
        close: v.string(),
      }),
      sunday: v.object({
        closed: v.boolean(),
        open: v.string(),
        close: v.string(),
      }),
    })
  ),
}).index('by_external_id', ['externalId']);

const crowdCountsTable = defineTable({
  externalVenueId: v.string(),
  count: v.number(),
  groupSize: v.number(),
  timezone: v.string(),
  lastResetDate: v.optional(v.string()),
}).index('by_external_venue_id', ['externalVenueId']);

const dailyCrowdCountsTable = defineTable({
  externalVenueId: v.string(),
  totalCount: v.number(),
  date: v.string(),
}).index('by_date', ['date']);

export default defineSchema({
  users: usersTable,
  venues: venuesTable,
  crowdCounts: crowdCountsTable,
  dailyCrowdCounts: dailyCrowdCountsTable,
});
