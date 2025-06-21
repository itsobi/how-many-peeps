import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getCrowdCount = query({
  args: { externalOrgId: v.string() },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity();

    if (!identity) throw new Error('Not Authorized');

    const crowdCount = await ctx.db
      .query('crowdCounts')
      .withIndex('by_external_organization_id', (q) =>
        q.eq('externalOrganizationId', args.externalOrgId)
      )
      .first();

    return crowdCount;
  },
});

export const getGroupSize = query({
  args: { externalOrgId: v.string() },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity();

    if (!identity) throw new Error('Not Authorized');

    const record = await ctx.db
      .query('crowdCounts')
      .withIndex('by_external_organization_id', (q) =>
        q.eq('externalOrganizationId', args.externalOrgId)
      )
      .first();

    return record?.groupSize;
  },
});

export const updateCrowdCount = mutation({
  args: {
    externalOrgId: v.string(),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity();

    if (!identity) throw new Error('Not Authorized');

    try {
      const existingRecord = await ctx.db
        .query('crowdCounts')
        .withIndex('by_external_organization_id', (q) =>
          q.eq('externalOrganizationId', args.externalOrgId)
        )
        .first();

      if (existingRecord) {
        await ctx.db.patch(existingRecord._id, {
          count: args.count,
        });
        return {
          success: true,
          message: 'Crowd count updated',
        };
      } else {
        await ctx.db.insert('crowdCounts', {
          externalOrganizationId: args.externalOrgId,
          count: args.count,
          groupSize: 0,
        });
        return {
          success: true,
          message: 'Crowd count updated',
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Unable to update crowd count. Please try again.',
      };
    }
  },
});

export const updateGroupSize = mutation({
  args: {
    externalOrgId: v.string(),
    groupSize: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity();

    if (!identity) throw new Error('Not Authorized');

    try {
      const existingRecord = await ctx.db
        .query('crowdCounts')
        .withIndex('by_external_organization_id', (q) =>
          q.eq('externalOrganizationId', args.externalOrgId)
        )
        .first();

      if (existingRecord) {
        await ctx.db.patch(existingRecord._id, {
          groupSize: args.groupSize,
        });
        return {
          success: true,
          message: 'Group size updated',
        };
      } else {
        await ctx.db.insert('crowdCounts', {
          externalOrganizationId: args.externalOrgId,
          count: 0,
          groupSize: args.groupSize,
        });
        return {
          success: true,
          message: 'Group size updated',
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Unable to update group enter. Please try again.',
      };
    }
  },
});
