import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';

export const createUser = internalMutation({
  args: {
    externalId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.string(),
    canCreateOrganization: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userExist = await ctx.db
      .query('users')
      .withIndex('by_external_id', (q) => q.eq('externalId', args.externalId))
      .first();

    if (userExist) return;

    await ctx.db.insert('users', {
      externalId: args.externalId,
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      imageUrl: args.imageUrl,
      canCreateOrganization: false,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    externalId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updateFields: any = {};

    const user = await ctx.db
      .query('users')
      .withIndex('by_external_id', (q) => q.eq('externalId', args.externalId))
      .first();

    if (!user) throw new Error('User does not exist');

    if (args.firstName !== undefined || null) {
      updateFields.username = args.firstName;
    }

    if (args.lastName !== undefined || null) {
      updateFields.username = args.lastName;
    }

    if (args.imageUrl !== undefined) {
      updateFields.imageUrl = args.imageUrl;
    }

    await ctx.db.patch(user._id, updateFields);
  },
});

export const deleteUser = internalMutation({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_external_id', (q) => q.eq('externalId', args.externalId))
      .first();

    if (!user) throw new Error('User does not exist');

    await ctx.db.delete(user._id);
  },
});

export const canUserCreateOrganization = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const userId = identity?.subject;

    if (!userId) {
      return false;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_external_id', (q) => q.eq('externalId', userId))
      .first();

    return user?.canCreateOrganization;
  },
});
