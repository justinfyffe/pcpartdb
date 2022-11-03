import { cookieService } from '@server/shared/cookie/cookie-service';
import { SESSION_COOKIE } from '@server/shared/cookie/cookies';
import { hashToken } from '@server/shared/crypto/crypto-utils';
import { unauthorizedError } from '@server/shared/errors/errors';
import { NextApiRequest, NextApiResponse } from 'next';
import { accessTokenRepository } from './access-token-repository';

export function withStaffGuard(
  controller: (req: NextApiRequest, res: NextApiResponse) => unknown,
) {
  const func = async (req: NextApiRequest, res: NextApiResponse) => {
    const token = cookieService.get(SESSION_COOKIE, {
      api: { req, res },
    }) as string;

    if (token == null) {
      throw unauthorizedError();
    }

    const accessToken = await accessTokenRepository.findByTokenHash(
      hashToken(token),
    );

    if (accessToken == null || accessToken.expiresAt < new Date()) {
      throw unauthorizedError();
    }

    if (!accessToken.user?.isStaff) {
      throw unauthorizedError();
    }

    await controller(req, res);
  };

  return func;
}
