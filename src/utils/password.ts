import { REGISTRATION } from '@config/registration';
import { Response } from 'express';
import { pwnedPassword } from 'hibp';
import { ENV } from './env';

type IsPasswordValidParams = {
  password: string | undefined;
  res: Response;
};

export const isPasswordValid = async ({
  password,
  res,
}: IsPasswordValidParams): Promise<boolean> => {
  if (!password) {
    res.boom.badRequest(`Password is not set`);
    return false;
  }

  // check min length
  if (password.length < ENV.MIN_PASSWORD_LENGTH) {
    res.boom.badRequest(
      `Password is too short. The password must be minimum ${ENV.MIN_PASSWORD_LENGTH} chars.`
    );
    return false;
  }

  // check if compromised
  if (REGISTRATION.HIBP_ENABLED && (await pwnedPassword(password))) {
    res.boom.badRequest('Password is too weak.');
    return false;
  }

  return true;
};