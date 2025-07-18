import { v } from 'convex/values';
import { query, mutation, internalMutation } from './_generated/server';
import { DateTime } from 'luxon';
import { api } from './_generated/api';

export const getCrowdCountAndGroupSize = query({
  args: { venueId: v.string() },
  handler: async (ctx, args) => {
    if (!args.venueId) {
      throw new Error('Venue ID is required');
    }
    const identity = ctx.auth.getUserIdentity();

    if (!identity) throw new Error('Not Authorized');

    const crowdCount = await ctx.db
      .query('crowdCounts')
      .withIndex('by_external_venue_id', (q) =>
        q.eq('externalVenueId', args.venueId)
      )
      .first();

    return {
      crowdCount: crowdCount?.count,
      groupSize: crowdCount?.groupSize,
    };
  },
});

export const updateCrowdCount = mutation({
  args: {
    venueId: v.string(),
    timezone: v.string(),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity();

    if (!identity) throw new Error('Not Authorized');

    try {
      const existingRecord = await ctx.db
        .query('crowdCounts')
        .withIndex('by_external_venue_id', (q) =>
          q.eq('externalVenueId', args.venueId)
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
          externalVenueId: args.venueId,
          timezone: args.timezone,
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
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity();

    if (!identity) throw new Error('Not Authorized');

    try {
      const existingRecord = await ctx.db
        .query('crowdCounts')
        .withIndex('by_external_venue_id', (q) =>
          q.eq('externalVenueId', args.externalOrgId)
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
          externalVenueId: args.externalOrgId,
          count: 0,
          groupSize: args.groupSize,
          timezone: args.timezone,
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

export const deleteCrowdCount = internalMutation({
  args: {
    externalOrgId: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query('crowdCounts')
      .withIndex('by_external_venue_id', (q) =>
        q.eq('externalVenueId', args.externalOrgId)
      )
      .first();

    if (!record) return; // record might not exist. Just return if it doesn't

    await ctx.db.delete(record._id);
  },
});

export const setCountToZero = mutation({
  args: {
    crowdCountId: v.id('crowdCounts'),
    todayString: v.string(),
  },
  handler: async (ctx, args) => {
    const crowdCount = await ctx.db.get(args.crowdCountId);

    if (!crowdCount) {
      throw new Error('Crowd count not found');
    }

    if (crowdCount.count === 0) {
      return;
    }

    await ctx.db.patch(args.crowdCountId, {
      count: 0,
      lastResetDate: args.todayString ?? undefined,
    });
  },
});

export const resetAllVenueCounters = mutation({
  handler: async (ctx) => {
    const crowdCounts = await ctx.db.query('crowdCounts').collect();
    const nowUTC = DateTime.utc();

    for (const crowdCount of crowdCounts) {
      const nowInTimezone = nowUTC.setZone(crowdCount.timezone);
      const todayString = nowInTimezone.toISODate();

      if (
        nowInTimezone.hour === 0 &&
        nowInTimezone.minute < 10 &&
        crowdCount.lastResetDate !== todayString
      ) {
        await ctx.scheduler.runAfter(0, api.crowdCounts.setCountToZero, {
          crowdCountId: crowdCount._id,
          todayString: todayString ?? '',
        });
      }
    }
  },
});
