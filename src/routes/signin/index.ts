import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import { asyncWrapper as aw } from '@/helpers';
import {
  signInEmailPasswordSchema,
  signInAnonymousSchema,
  signInMfaTotpSchema,
  signInOtpSchema,
  signInPasswordlessEmailSchema,
  signInPasswordlessSmsSchema,
} from '@/validation';
import { signInEmailPasswordHandler } from './email-password';
import { signInAnonymousHandler } from './anonymous';
import providers from './providers';
import { signInOtpHandler } from './passwordless/sms/otp';
import {
  signInPasswordlessEmailHandler,
  signInPasswordlessSmsHandler,
} from './passwordless';
import { signInMfaTotpHandler } from './mfa';

const router = Router();

/**
 * POST /signin/email-password
 * @summary Authenticate with email + password
 * @param {SignInEmailPasswordSchema} request.body.required
 * @return {SessionPayload} 200 - Signed in successfully - application/json
 * @return {string} 400 - The payload is invalid - text/plain
 * @return {PasswordEmailSigninError} 401 - Error - application/json
 * @return {string} 404 - The feature is not activated - text/plain
 * @tags Authentication
 */
router.post(
  '/signin/email-password',
  createValidator().body(signInEmailPasswordSchema),
  aw(signInEmailPasswordHandler)
);

/**
 * POST /signin/passwordless/email
 * @summary Email passwordless authentication
 * @param {SignInPasswordlessEmailSchema} request.body.required
 * @return {string} 200 - Email sent successfully - text/plain
 * @return {string} 400 - The payload is invalid - text/plain
 * @return {DisabledUserError} 401 - User is disabled - application/json
 * @return {string} 404 - The feature is not activated - text/plain
 * @tags Authentication
 */
router.post(
  '/signin/passwordless/email',
  createValidator().body(signInPasswordlessEmailSchema),
  aw(signInPasswordlessEmailHandler)
);

/**
 * POST /signin/passwordless/sms
 * @summary Send a one-time password by SMS
 * @param {SignInPasswordlessSmsSchema} request.body.required
 * @return {string} 200 - SMS sent successfully - text/plain
 * @return {string} 400 - The payload is invalid - text/plain
 * @return {string} 404 - The feature is not activated - text/plain
 * @tags Authentication
 */
router.post(
  '/signin/passwordless/sms',
  createValidator().body(signInPasswordlessSmsSchema),
  aw(signInPasswordlessSmsHandler)
);

/**
 * POST /signin/passwordless/sms/otp
 * @summary Passwordless authentication from a one-time password code received by SMS
 * @param {SignInOtpSchema} request.body.required
 * @return {SessionPayload} 200 - User successfully authenticated - application/json
 * @return {string} 400 - The payload is invalid - text/plain
 * @return {object} 401 - Error processing the request - application/json
 * @return {string} 404 - The feature is not activated - text/plain
 * @tags Authentication
 */
router.post(
  '/signin/passwordless/sms/otp',
  createValidator().body(signInOtpSchema),
  aw(signInOtpHandler)
);

/**
 * POST /signin/anonymous
 * @summary Anonymous authentication
 * @param {SignInAnonymousSchema} request.body.required
 * @return {SessionPayload} 200 - User successfully authenticated - application/json
 * @return {string} 400 - The payload is invalid - text/plain
 * @return {string} 404 - The feature is not activated - text/plain
 * @tags Authentication
 */
router.post(
  '/signin/anonymous',
  createValidator().body(signInAnonymousSchema),
  aw(signInAnonymousHandler)
);

// sign in using providers
providers(router);

/**
 * POST /signin/mfa/totp
 * @summary Sign in with a Time-base One-Time Password (TOTP) ticket
 * @param {SignInMfaTotpSchema} request.body.required
 * @return {SessionPayload} 200 - User successfully authenticated - application/json
 * @return {string} 400 - The payload is invalid - text/plain
 * @return {string} 404 - The feature is not activated - text/plain
 * @tags Authentication
 */
router.post(
  '/signin/mfa/totp',
  createValidator().body(signInMfaTotpSchema),
  aw(signInMfaTotpHandler)
);

// TODO: Implement:
// router.post(
//   '/signin/mfa/sms',
//   createValidator().body(signInMfaSmsSchema),
//   aw(signInMfaSmsHandler)
// );

const signInRouter = router;
export { signInRouter };
