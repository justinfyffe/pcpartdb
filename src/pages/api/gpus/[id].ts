import { deleteGpu, updateGpu } from '@server/gpus/gpu-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    return updateGpu(req, res);
  } else if (req.method === 'DELETE') {
    return deleteGpu(req, res);
  } else {
    res.status(404);
    return null;
  }
}
