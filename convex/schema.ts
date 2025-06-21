import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.string(),
    canCreateOrganization: v.boolean(),
  }).index('by_external_id', ['externalId']),
  crowdCounts: defineTable({
    externalOrganizationId: v.string(),
    count: v.number(),
    groupSize: v.number(),
  }).index('by_external_organization_id', ['externalOrganizationId']),
  dailyCrowdCounts: defineTable({
    externalOrganizationId: v.string(),
    totalCount: v.number(),
    date: v.string(),
  }).index('by_date', ['date']),
});
