import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

const proxy = createProxyMiddleware({
  target: process.env.API_URL,
});

export default function handler(req: any, res: any) {
  proxy(req, res, (err) => {
    if (err) {
      throw err;
    }

    throw new Error(
      `Request '${req.url}' is not proxied! We should never reach here!`,
    );
  });
}
