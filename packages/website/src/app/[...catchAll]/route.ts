import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const CWD_PATH = path.resolve(process.cwd());
const PRIORITY_SITEMAPS_PATH = path.join(
  CWD_PATH,
  '../..',
  'data',
  'priority-sitemaps',
);
const SITEMAPS_PATH = path.join(CWD_PATH, '../..', 'data', 'sitemaps');

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const sitemapPath = path.join(SITEMAPS_PATH, pathname);
  if (pathname.startsWith('/sitemap-') && fs.existsSync(sitemapPath)) {
    const stat = await fsPromises.stat(sitemapPath);
    const sitemap = await fsPromises.readFile(sitemapPath);
    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/gzip',
        'Content-Length': `${stat.size}`,
      },
    });
  }

  const prioritySitemapPath = path.join(PRIORITY_SITEMAPS_PATH, pathname);
  if (
    pathname.startsWith('/priority-sitemap-') &&
    fs.existsSync(prioritySitemapPath)
  ) {
    const stat = await fsPromises.stat(prioritySitemapPath);
    const sitemap = await fsPromises.readFile(prioritySitemapPath);
    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/gzip',
        'Content-Length': `${stat.size}`,
      },
    });
  }

  const url404 = `${process.env.WEBSITE_URL}/404`;
  const response404 = await fetch(url404, {
    method: 'GET',
    credentials: 'include',
  });
  return new Response(response404.body, {
    status: 404,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
