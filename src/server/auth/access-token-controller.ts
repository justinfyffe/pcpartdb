import { transaction } from '@server/db/database';
import { cookieService } from '@server/shared/cookie/cookie-service';
import { SESSION_COOKIE } from '@server/shared/cookie/cookies';
import { hashToken } from '@server/shared/crypto/crypto-utils';
import { serialize } from '@server/shared/types/serialize';
import type { AccessToken, LoginRequest } from '@shared/auth';
import { User } from '@shared/user';
import { NextApiRequest, NextApiResponse } from 'next';
import { accessTokenRepository } from './access-token-repository';
import { accessTokenService } from './access-token-service';

export class AccessTokenController {
  async checkAuthentication(req: NextApiRequest, res: NextApiResponse) {
    const token = cookieService.get(SESSION_COOKIE, {
      api: { req, res },
    }) as string;

    if (token != null) {
      const accessToken = await accessTokenRepository.findByTokenHash(
        hashToken(token),
      );

      res.status(200).send({
        user: serialize(accessToken.user) as User,
      } as AccessToken);
    } else {
      res.status(200).send({});
    }
  }

  async login(req: NextApiRequest, res: NextApiResponse) {
    const body: LoginRequest = req.body;
    await transaction(async (trx) => {
      await accessTokenService.login(body, {
        trx,
        api: { req, res },
      });

      res.status(200).send({});
    });
  }

  async logout(req: NextApiRequest, res: NextApiResponse) {
    const token = cookieService.get(SESSION_COOKIE, {
      api: { req, res },
    }) as string;

    const accessToken = await accessTokenRepository.findByTokenHash(
      hashToken(token),
    );

    const user = serialize(accessToken.user) as User;

    await transaction(async (trx) => {
      await accessTokenService.logout(user, {
        trx,
        api: { req, res },
      });

      res.status(204).send({});
    });
  }
}

export const accessTokenController = new AccessTokenController();
