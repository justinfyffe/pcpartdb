import { deletePart, updatePart } from '@server/part/part-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    return updatePart(req, res);
  } else if (req.method === 'DELETE') {
    return deletePart(req, res);
  } else {
    res.status(404);
    return null;
  }
}
