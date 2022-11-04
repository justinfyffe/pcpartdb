import {
  deleteImage,
  getImage,
  updateImage,
} from '@server/images/image-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    return updateImage(req, res);
  } else if (req.method === 'DELETE') {
    return deleteImage(req, res);
  } else {
    return getImage(req, res);
  }
}
