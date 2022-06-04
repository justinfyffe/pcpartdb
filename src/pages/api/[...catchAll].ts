import { NextApiRequest, NextApiResponse } from 'next';
import { Api } from '../../api/main';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve) => {
    const listener = await Api.getListener();
    listener(req, res);
    res.on('finish', resolve);
  });
