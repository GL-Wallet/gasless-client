export const stripPrivateKeyPrefix = (privateKey: string) => {
  return privateKey.replace('0x', '');
};
