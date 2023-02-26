import { createGpu, listGpus } from '@server/gpus/gpu-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return createGpu(req, res);
  } else if (req.method === 'GET') {
    return listGpus(req, res);
  } else {
    res.status(404).json({});
    return null;
  }
}
