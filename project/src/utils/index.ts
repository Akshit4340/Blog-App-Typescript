export const genUsername = () => {
  const usernamePrefix = 'user_';
  const randomString = Math.random().toString(36).slice(2);
  return usernamePrefix + randomString;
};
