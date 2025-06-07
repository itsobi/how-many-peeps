import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.string(),
    role: v.union(v.literal('admin'), v.literal('staff'), v.literal('user')),
    barId: v.optional(v.id('bars')),
  })
    .index('by_external_id', ['externalId'])
    .index('by_bar_id', ['barId']),
  bars: defineTable({
    name: v.string(),
    address: v.string(),
    imageUrl: v.string(),
    countPastMidnight: v.boolean(),
  }),
  crowdCounts: defineTable({
    barId: v.id('bars'),
    count: v.number(),
  }).index('by_bar_id', ['barId']),
  dailyCrowdCounts: defineTable({
    barId: v.id('bars'),
    totalCount: v.number(),
    date: v.string(),
  }).index('by_date', ['date']),
});
