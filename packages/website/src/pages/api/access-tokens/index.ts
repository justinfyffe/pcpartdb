import {
  login,
  logout,
} from '@pcpartdb/website/server/auth/access-token-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return login(req, res);
  } else if (req.method === 'DELETE') {
    return logout(req, res);
  } else {
    res.status(404).json({});
    return null;
  }
}
