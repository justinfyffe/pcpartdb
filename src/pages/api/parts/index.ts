import { createPart, listParts } from '@server/part/part-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return createPart(req, res);
  } else if (req.method === 'GET') {
    return listParts(req, res);
  } else {
    res.status(404);
    return null;
  }
}
