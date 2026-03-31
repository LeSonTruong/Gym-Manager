import type { DemoUser, UserRole } from '@next-nest-turbo-boilerplate/shared';

export type AuthenticatedUser = {
  user: DemoUser;
  role: UserRole;
  ptId?: string;
  sessionId: string;
  accessToken: string;
};
