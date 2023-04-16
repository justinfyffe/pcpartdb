import { GpuRepository, mapToGpuDtos } from '@pcpartdb/database';
import {
  getAboutPath,
  getCompareGpusPath,
  getListGpusPath,
  getPrivacyPath,
  getViewGpuPath,
  GpuOrder,
  GpuSort,
  LIST_GPUS_PRESETS,
  WEBSITE_URL,
} from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import xml from 'xml';
import { getDatabase } from '../shared/database';
import { sitemapPath, sitemapUrl } from './utils';

const COMPARISONS_PER_SITEMAP = 40_000;

const INDEX_FILENAME = 'sitemap-index.xml';
const GENERAL_FILENAME = 'sitemap-general.xml';
const GPU_LISTS_FILENAME = 'sitemap-gpu-lists.xml';
const GPU_VIEWS_FILENAME = 'sitemap-gpu-views.xml';
const GPU_COMPARISONS_FILENAME = 'sitemap-gpu-comparisons-{i}.xml';

interface SitemapEntry {
  url: string;
  lastModification?: Date;
}

export async function updateSitemap() {
  await removeExistingSitemaps();

  const sitemapUrls = [
    await writeGeneralSitemap(),
    await writeGpuListsSitemap(),
    await writeGpuViewsSitemap(),
    ...(await writeGpuComparisonsSitemap()),
  ];

  await writeSitemapIndex(sitemapUrls);
}

async function writeGeneralSitemap() {
  console.log('Generating General sitemap');

  const entries = [
    { url: WEBSITE_URL },
    { url: sitemapUrl(getAboutPath()) },
    { url: sitemapUrl(getPrivacyPath()) },
  ] as SitemapEntry[];

  await writeSitemap(sitemapPath(GENERAL_FILENAME), entries);
  return sitemapUrl(GENERAL_FILENAME);
}

async function writeGpuListsSitemap() {
  console.log('Generating GPU Lists sitemap');

  const entries: SitemapEntry[] = Object.entries(LIST_GPUS_PRESETS).map(
    ([_key, preset]) => ({
      url: sitemapUrl(getListGpusPath(preset)),
    }),
  );

  await writeSitemap(sitemapPath(GPU_LISTS_FILENAME), entries);
  return sitemapUrl(GPU_LISTS_FILENAME);
}

async function writeGpuViewsSitemap() {
  console.log('Generating GPU Views sitemap');

  const db = await getDatabase();
  const gpuRepository = new GpuRepository(db);

  const results = await gpuRepository.listAll({
    query: {
      orderBy: { sort: GpuSort.ReleaseDate, order: GpuOrder.Desc },
    },
  });
  console.log(`Read ${results.length} gpus`);
  const gpus = mapToGpuDtos(results);

  const entries: SitemapEntry[] = gpus.map((gpu) => ({
    url: sitemapUrl(getViewGpuPath(gpu)),
    lastModification:
      gpu.updatedAt != null ? new Date(gpu.updatedAt) : undefined,
  }));

  await writeSitemap(sitemapPath(GPU_VIEWS_FILENAME), entries);
  return sitemapUrl(GPU_VIEWS_FILENAME);
}

async function writeGpuComparisonsSitemap() {
  console.log('Generating GPU Comparison sitemap');

  const db = await getDatabase();
  const gpuRepository = new GpuRepository(db);

  const results = await gpuRepository.listAll({
    query: {
      orderBy: { sort: GpuSort.ReleaseDate, order: GpuOrder.Desc },
    },
  });
  console.log(`Read ${results.length} gpus`);
  const gpus = mapToGpuDtos(results);

  let fileCounter = 0;
  let entriesCounter = 0;
  let entries: SitemapEntry[] = [];
  const sitemapUrls: string[] = [];

  for (let i = 0; i < gpus.length - 1; ++i) {
    for (let j = i + 1; j < gpus.length; ++j) {
      const gpu1 = gpus[i];
      const gpu2 = gpus[j];

      const url = sitemapUrl(
        getCompareGpusPath([gpu1, gpu2], {
          ordered: true,
        }),
      );
      const lastModTimestamp = Math.max(
        gpu1.updatedAt ?? 0,
        gpu2.updatedAt ?? 0,
      );
      const lastModification =
        lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

      entries.push({ url, lastModification });

      if (++entriesCounter >= COMPARISONS_PER_SITEMAP) {
        const filename = GPU_COMPARISONS_FILENAME.replace(
          '{i}',
          `${fileCounter}`,
        );
        sitemapUrls.push(sitemapUrl(filename));
        await writeSitemap(sitemapPath(filename), entries);
        entries = [];
        entriesCounter = 0;
        fileCounter++;
      }
    }
  }

  if (entriesCounter > 0) {
    const filename = GPU_COMPARISONS_FILENAME.replace('{i}', `${fileCounter}`);
    sitemapUrls.push(sitemapUrl(filename));
    await writeSitemap(sitemapPath(filename), entries);
  }

  return sitemapUrls;
}

async function writeSitemapIndex(sitemapUrls: string[]) {
  const items = sitemapUrls.map((loc) => ({ sitemap: [{ loc }] }));

  const indexObject = {
    sitemapindex: [
      { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' } },
      ...items,
    ],
  };

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n${xml(
    indexObject,
    { indent: ' ' },
  )}`;
  await fsPromises.writeFile(
    sitemapPath(INDEX_FILENAME),
    sitemapIndex,
    'utf-8',
  );
}

async function writeSitemap(path: string, entries: SitemapEntry[]) {
  const items = entries.map((entry) => generateSitemapUrlObject(entry));

  const sitemapObject = {
    urlset: [
      { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' } },
      ...items,
    ],
  };

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n${xml(
    sitemapObject,
    { indent: ' ' },
  )}`;
  await fsPromises.writeFile(path, sitemap, 'utf-8');
}

async function removeExistingSitemaps() {
  const paths = await fsPromises.readdir(sitemapPath());
  console.log(`Removing existing ${paths} sitemaps`);
  for (const path of paths) {
    await fsPromises.rm(sitemapPath(path));
  }
}

function generateSitemapUrlObject(entry: SitemapEntry) {
  if (entry.lastModification != null) {
    return {
      url: [
        { loc: entry.url },
        { lastmod: entry.lastModification.toISOString().split('T')[0] },
      ],
    };
  }

  return { url: [{ loc: entry.url }] };
}
