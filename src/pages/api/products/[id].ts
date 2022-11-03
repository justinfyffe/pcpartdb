import { productController } from '@server/product/product-controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    return productController.update(req, res);
  } else if (req.method === 'DELETE') {
    return productController.delete(req, res);
  } else {
    return productController.get(req, res);
  }
}
