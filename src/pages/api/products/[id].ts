import {
  deleteProduct,
  updateProduct,
} from '@server/product/product-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    return updateProduct(req, res);
  } else if (req.method === 'DELETE') {
    return deleteProduct(req, res);
  } else {
    res.status(404);
    return null;
  }
}
