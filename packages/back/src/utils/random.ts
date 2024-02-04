import crypto from 'crypto-js';

export default (length = 256) => {
  crypto.lib.WordArray.random(length / 8).toString();
};

export const generateConfirmationCode = () => {
  return Math.random().toString().substring(2, 8);
};
