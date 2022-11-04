import { createImage, listImages } from '@server/images/image-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return createImage(req, res);
  } else {
    return listImages(req, res);
  }
}
