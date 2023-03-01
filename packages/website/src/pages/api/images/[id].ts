import {
  deleteImage,
  updateImage,
} from '@pcpartdb/website/server/images/image-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    return updateImage(req, res);
  } else if (req.method === 'DELETE') {
    return deleteImage(req, res);
  } else {
    res.status(404).json({});
    return null;
  }
}
