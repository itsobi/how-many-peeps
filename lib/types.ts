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
