import { createUser } from '@server/user/user-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return createUser(req, res);
  } else {
    res.status(404);
    return null;
  }
}
