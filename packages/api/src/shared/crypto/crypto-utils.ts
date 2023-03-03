import * as crypto from 'crypto';

const HASH_ALGO = 'sha256';
const HASH_ENCODING = 'hex';
const TOKEN_ENCODING = 'hex';
const TOKEN_SIZE = 64;

export function generateToken(size = TOKEN_SIZE) {
  return crypto.randomBytes(size).toString(TOKEN_ENCODING);
}

export function hashToken(token: string) {
  return crypto.createHash(HASH_ALGO).update(token).digest(HASH_ENCODING);
}
