import jwt from 'jsonwebtoken';
import { AUTH_SECRET } from '../lib/env';

/**
 * Signs a JWT token with the given payload.
 * The token expires after 7 days, so users stay logged in
 * without needing to re-authenticate too frequently.
 */
export const signToken = (payload: any) => {
    return jwt.sign(payload, AUTH_SECRET!, { expiresIn: '7d' })
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * Throws an error if the token is invalid or expired.
 * The generic type T lets callers type-cast the returned payload.
 */
export const verifyToken = <T>(token: string) => {
    return jwt.verify(token, AUTH_SECRET!)
};
