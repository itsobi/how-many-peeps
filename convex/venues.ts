import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';

export const createVenue = internalMutation({
  args: {
    externalId: v.string(),
    name: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('venues', {
      externalId: args.externalId,
      name: args.name,
      imageUrl: args.imageUrl,
    });
  },
});

export const deleteVenue = internalMutation({
  args: {
    externalId: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query('venues')
      .withIndex('by_external_id', (q) => q.eq('externalId', args.externalId))
      .first();

    if (!record) throw new Error('Venue does not exist');

    await ctx.db.delete(record._id);
  },
});

export const getAllVenues = query({
  handler: async (ctx) => {
    const venues = await ctx.db.query('venues').collect();

    const organizationsWithCrowdCount = await Promise.all(
      venues.map(async (venue) => {
        const crowdCount = await ctx.db
          .query('crowdCounts')
          .withIndex('by_external_venue_id', (q) =>
            q.eq('externalVenueId', venue.externalId)
          )
          .first();

        return {
          ...venue,
          crowdCount: crowdCount?.count ?? 0,
        };
      })
    );

    return organizationsWithCrowdCount;
  },
});

export const getVenue = query({
  args: {
    externalVenueId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.externalVenueId) {
      return undefined;
    }

    const venue = await ctx.db
      .query('venues')
      .withIndex('by_external_id', (q) =>
        q.eq('externalId', args.externalVenueId!)
      )
      .first();

    if (!venue) {
      return undefined;
    }

    return venue;
  },
});

export const updateVenueInternalConvex = internalMutation({
  args: {
    externalId: v.string(),
    name: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const venue = await ctx.db
      .query('venues')
      .withIndex('by_external_id', (q) => q.eq('externalId', args.externalId))
      .first();

    if (!venue) {
      throw new Error('Organization does not exist');
    }

    await ctx.db.patch(venue._id, {
      name: args.name,
      imageUrl: args.imageUrl,
    });
  },
});

export const updateVenue = mutation({
  args: {
    externalId: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    type: v.optional(v.string()),
    address: v.optional(v.string()),
    website: v.optional(v.string()),
    description: v.optional(v.string()),
    established: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const venue = await ctx.db
      .query('venues')
      .withIndex('by_external_id', (q) => q.eq('externalId', args.externalId))
      .first();

    if (!venue) {
      throw new Error('Venue does not exist');
    }

    const updates: any = {};

    if (args.name !== undefined) updates.name = args.name;
    if (args.imageUrl !== undefined) updates.imageUrl = args.imageUrl;
    if (args.city !== undefined) updates.city = args.city;
    if (args.state !== undefined) updates.state = args.state;
    if (args.type !== undefined) updates.type = args.type;
    if (args.address !== undefined) updates.address = args.address;
    if (args.website !== undefined) updates.website = args.website;
    if (args.description !== undefined) updates.description = args.description;
    if (args.established !== undefined) updates.established = args.established;
    if (args.hours !== undefined) updates.hours = args.hours;

    try {
      await ctx.db.patch(venue._id, updates);
      return {
        success: true,
        message: 'Venue updated successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Failed to update organization',
      };
    }
  },
});

export const createVenueMembership = internalMutation({
  args: {
    venueExternalId: v.string(),
    userExternalId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const venue = await ctx.db
      .query('venues')
      .withIndex('by_external_id', (q) =>
        q.eq('externalId', args.venueExternalId)
      )
      .first();

    if (!venue) {
      throw new Error('Venue does not exist');
    }

    await ctx.db.patch(venue._id, {
      members: {
        [args.userExternalId]: {
          role: args.role,
        },
      },
    });
  },
});

export const deleteVenueMembership = internalMutation({
  args: {
    venueExternalId: v.string(),
    userExternalId: v.string(),
  },
  handler: async (ctx, args) => {
    const venue = await ctx.db
      .query('venues')
      .withIndex('by_external_id', (q) =>
        q.eq('externalId', args.venueExternalId)
      )
      .first();

    if (!venue) {
      throw new Error('Venue does not exist');
    }

    // This line uses object destructuring to:
    // 1. Extract and remove the member with key userExternalId (stored in 'removed')
    // 2. Keep all other members in the 'remainingMembers' object
    // 3. Fallback to empty object if venue.members is undefined
    const { [args.userExternalId]: removed, ...remainingMembers } =
      venue.members || {};
    await ctx.db.patch(venue._id, {
      members: remainingMembers,
    });
  },
});

export const getVenueOnClient = query({
  args: {
    externalUserId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.externalUserId) {
      return null;
    }

    const venues = await ctx.db.query('venues').collect();
    const venue = venues.find((v) => v.members?.[args.externalUserId]);

    if (!venue) {
      return null;
    }

    return venue;
  },
});
