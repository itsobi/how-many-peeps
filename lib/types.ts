export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  createdAt: Date;
  role: 'admin' | 'user';
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

export const roleEnum = {
  ADMIN: 'org:admin',
  MEMBER: 'org:member',
};
