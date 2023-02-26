import { updateUser } from '@server/user/user-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    return updateUser(req, res);
  } else {
    res.status(404).json({});
    return null;
  }
}
