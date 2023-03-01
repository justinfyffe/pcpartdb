import { createUser } from '@pcpartdb/website/server/user/user-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return createUser(req, res);
  } else {
    res.status(404).json({});
    return null;
  }
}
