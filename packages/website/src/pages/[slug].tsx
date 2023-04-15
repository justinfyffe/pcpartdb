import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { NextPageContext } from 'next';
import path from 'path';

const CWD_PATH = path.resolve(process.cwd());
const SITEMAPS_PATH = path.join(CWD_PATH, '../..', 'data', 'sitemaps');

export async function getServerSideProps(ctx: NextPageContext) {
  const slug = ctx.query.slug as string;

  // Handle XML sitemaps
  if (
    slug.startsWith('sitemap-') &&
    fs.existsSync(path.join(SITEMAPS_PATH, slug))
  ) {
    const sitemap = await fsPromises.readFile(
      path.join(SITEMAPS_PATH, slug),
      'utf-8',
    );
    const res = ctx.res;
    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
    return { props: {} };
  }

  return { notFound: true };
}

export default function () {}
