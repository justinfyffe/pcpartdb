import { accessTokenController } from '@server/auth/access-token-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return accessTokenController.login(req, res);
  } else if (req.method === 'DELETE') {
    return accessTokenController.logout(req, res);
  } else {
    return accessTokenController.checkAuthentication(req, res);
  }
}
