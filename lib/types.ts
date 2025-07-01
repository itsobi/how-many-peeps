import { Id } from '@/convex/_generated/dataModel';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  createdAt: Date;
  role: roleEnum;
};

export type Invitation = {
  id: string;
  email: string;
  status: string;
  createdAt: Date;
};

export type Venue = {
  _id: Id<'venues'>;
  crowdCount: number;
  _creationTime: number;
  externalId: string;
  name: string;
  imageUrl: string;
  city?: string;
  state?: string;
  address?: string | undefined;
  website?: string | undefined;

  type?: string;
};

export const OrgUserMembershipsParams = {
  userMemberships: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

export const OrgMembersParams = {
  memberships: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

export const OrgInvitationsParams = {
  invitations: {
    pageSize: 5,
    keepPreviousData: true,
  },
};

export enum roleEnum {
  ADMIN = 'org:admin',
  MEMBER = 'org:member',
}

export enum organizationTypeEnum {
  BAR = 'bar',
  RESTAURANT = 'restaurant',
  OTHER = 'other',
}
