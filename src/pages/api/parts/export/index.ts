import { exportPart } from '@server/part/part-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return exportPart(req, res);
  } else {
    res.status(404);
    return null;
  }
}
