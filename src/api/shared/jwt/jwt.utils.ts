import * as jwt from 'jsonwebtoken';

export enum JwtType {
  ResetPassword = 'RESET_PASSWORD',
}

function getSecret(type: JwtType) {
  switch (type) {
    case JwtType.ResetPassword:
      return process.env.JWT_SECRET_RESET_PASSWORD;
    default:
      return null;
  }
}

export function generateJwt<T extends string | Record<string, unknown>>(
  type: JwtType,
  payload: T,
  options?: jwt.SignOptions,
) {
  return jwt.sign(payload, getSecret(type), options);
}

export function verifyJwt(type: JwtType, token: string) {
  try {
    jwt.verify(token, getSecret(type));
    return true;
  } catch {
    return false;
  }
}

export function decodeJwt<T = unknown>(token: string) {
  return jwt.decode(token) as T;
}
