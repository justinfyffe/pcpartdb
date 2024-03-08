import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const CWD_PATH = path.resolve(process.cwd());
const DATA_PATH = path.join(CWD_PATH, '../..', 'data', 'sitemaps');

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const filepath = path.join(DATA_PATH, pathname);
  if (pathname.startsWith('/sitemap-') && fs.existsSync(filepath)) {
    const stat = await fsPromises.stat(filepath);
    const sitemap = await fsPromises.readFile(filepath);
    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/gzip',
        'Content-Length': `${stat.size}`,
      },
    });
  }

  const url404 = `${url.protocol}//${url.host}/404`;
  const response404 = await fetch(url404);
  return new Response(response404.body, {
    status: 404,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
