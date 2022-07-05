import { Injectable } from '@nestjs/common';

const SESSION_EXPIRES = 1000 * 60 * 60 * 24; // 1 day
const COOKIE_EXPIRES = 1000 * 60 * 60 * 24 * 30; // 30 days

@Injectable()
export class AccessTokenService {}
