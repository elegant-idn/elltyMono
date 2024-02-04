import { User } from '../../../schemas/user.schema';

export const clearUserDto = (user: User) => {
  const {
    downloadsCounter,
    status,
    email,
    role,
    firstName,
    lastName,
    uuid,
    plan,
    avatar,
    cancelSubscriptionDisabled,
  } = user;
  return {
    status,
    email,
    role,
    remainingDownloads: downloadsCounter,
    plan,
    avatar,
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`,
    uuid,
    cancelSubscriptionDisabled,
  };
};
