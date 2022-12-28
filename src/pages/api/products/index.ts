import {
  createProduct,
  listProducts,
} from '@server/product/product-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return createProduct(req, res);
  } else if (req.method === 'GET') {
    return listProducts(req, res);
  } else {
    res.status(404);
    return null;
  }
}
