import { createProxyMiddleware } from 'http-proxy-middleware'; // @2.0.6

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

const proxy = createProxyMiddleware({
  target: process.env.API_URL,
  pathRewrite: { '^/api': '' }, // remove `/api` prefix
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
