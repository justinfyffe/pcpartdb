import { exportContent, importContent } from '@server/export/export-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return importContent(req, res);
  } else if (req.method === 'GET') {
    return exportContent(req, res);
  } else {
    res.status(404);
    return null;
  }
}
