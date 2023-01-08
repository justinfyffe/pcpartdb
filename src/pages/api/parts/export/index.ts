import { exportParts } from '@server/part/part-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return exportParts(req, res);
  } else {
    res.status(404);
    return null;
  }
}
