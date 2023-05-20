import { GpuRepository, mapToGpuDtos } from '@pcpartdb/database';
import {
  getAboutPath,
  getCompareGpusPath,
  getListGpusPath,
  getPrivacyPath,
  getViewGpuPath,
  LIST_GPUS_PRESETS,
  ListGpusOrder,
  ListGpusSort,
  WEBSITE_URL,
} from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import xml from 'xml';
import { getDatabase } from '../shared/database';
import { sitemapPath, sitemapUrl } from './utils';

const COMPARISONS_PER_SITEMAP = 45_000;
const CHIPSETS_PER_SITEMAP = 45_000;
const RETAIL_MODELS_PER_SITEMAP = 45_000;

const INDEX_FILENAME = 'sitemap-index.xml';
const GENERAL_FILENAME = 'sitemap-general.xml';
const GPU_LISTS_FILENAME = 'sitemap-gpu-lists.xml';
const GPU_CHIPSETS_FILENAME = 'sitemap-gpu-chipsets-{i}.xml';
const GPU_RETAIL_MODELS_FILENAME = 'sitemap-gpu-retail-models-{i}.xml';
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
    ...(await writeGpuChipsetsSitemap()),
    ...(await writeGpuRetailModelsSitemap()),
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
  console.log(`Generated ${GENERAL_FILENAME} with ${entries.length} entries`);

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
  console.log(`Generated ${GPU_LISTS_FILENAME} with ${entries.length} entries`);

  return sitemapUrl(GPU_LISTS_FILENAME);
}

async function writeGpuChipsetsSitemap() {
  console.log('Generating GPU Chipsets sitemap');

  const db = await getDatabase();
  const gpuRepository = new GpuRepository(db);

  const results = await gpuRepository.listAll({
    query: {
      filter: { isChipset: true, isRetailModel: false },
      orderBy: { sort: ListGpusSort.Name, order: ListGpusOrder.Asc },
    },
  });
  const gpus = mapToGpuDtos(results);

  let fileCounter = 0;
  let entries: SitemapEntry[] = [];
  let totalEntries = 0;
  const sitemapUrls: string[] = [];

  for (let i = 0; i < gpus.length - 1; ++i) {
    const gpu = gpus[i];

    const url = sitemapUrl(getViewGpuPath(gpu));
    const lastModTimestamp = Math.max(gpu.updatedAt ?? 0, gpu.updatedAt ?? 0);
    const lastModification =
      lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

    entries.push({ url, lastModification });
    ++totalEntries;

    if (entries.length >= CHIPSETS_PER_SITEMAP) {
      const filename = GPU_CHIPSETS_FILENAME.replace('{i}', `${fileCounter}`);
      sitemapUrls.push(sitemapUrl(filename));
      await writeSitemap(sitemapPath(filename), entries);
      console.log(`Generated  ${filename} with ${entries.length} entries`);

      entries = [];
      fileCounter++;
    }
  }

  if (entries.length > 0) {
    const filename = GPU_CHIPSETS_FILENAME.replace('{i}', `${fileCounter}`);
    sitemapUrls.push(sitemapUrl(filename));
    await writeSitemap(sitemapPath(filename), entries);
    console.log(`Generated ${filename} with ${entries.length} entries`);
  }

  console.log(`${totalEntries} total entries for GPU Retail Models sitemaps`);

  return sitemapUrls;
}

async function writeGpuRetailModelsSitemap() {
  console.log('Generating GPU Retail Models sitemap');

  const db = await getDatabase();
  const gpuRepository = new GpuRepository(db);

  const results = await gpuRepository.listAll({
    query: {
      filter: { isChipset: false, isRetailModel: true },
      orderBy: { sort: ListGpusSort.Name, order: ListGpusOrder.Asc },
    },
  });
  const gpus = mapToGpuDtos(results);

  let fileCounter = 0;
  let entries: SitemapEntry[] = [];
  let totalEntries = 0;
  const sitemapUrls: string[] = [];

  for (let i = 0; i < gpus.length - 1; ++i) {
    const gpu = gpus[i];

    const url = sitemapUrl(getViewGpuPath(gpu));
    const lastModTimestamp = Math.max(gpu.updatedAt ?? 0, gpu.updatedAt ?? 0);
    const lastModification =
      lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

    entries.push({ url, lastModification });
    ++totalEntries;

    if (entries.length >= RETAIL_MODELS_PER_SITEMAP) {
      const filename = GPU_RETAIL_MODELS_FILENAME.replace(
        '{i}',
        `${fileCounter}`,
      );
      sitemapUrls.push(sitemapUrl(filename));
      await writeSitemap(sitemapPath(filename), entries);
      console.log(`Generated  ${filename} with ${entries.length} entries`);

      entries = [];
      fileCounter++;
    }
  }

  if (entries.length > 0) {
    const filename = GPU_RETAIL_MODELS_FILENAME.replace(
      '{i}',
      `${fileCounter}`,
    );
    sitemapUrls.push(sitemapUrl(filename));
    await writeSitemap(sitemapPath(filename), entries);
    console.log(`Generated ${filename} with ${entries.length} entries`);
  }

  console.log(`${totalEntries} total entries for GPU Retail Models sitemaps`);

  return sitemapUrls;
}

async function writeGpuComparisonsSitemap() {
  console.log('Generating GPU Comparison sitemap');

  const db = await getDatabase();
  const gpuRepository = new GpuRepository(db);

  const results = await gpuRepository.listAll({
    query: {
      filter: { isChipset: true, isRetailModel: false },
      orderBy: { sort: ListGpusSort.ReleaseDate, order: ListGpusOrder.Desc },
    },
  });
  const gpus = mapToGpuDtos(results);

  let fileCounter = 0;
  let entries: SitemapEntry[] = [];
  let totalEntries = 0;
  const sitemapUrls: string[] = [];

  for (let i = 0; i < gpus.length - 1; ++i) {
    for (let j = i + 1; j < gpus.length; ++j) {
      const gpu1 = gpus[i];
      const gpu2 = gpus[j];

      const url1 = sitemapUrl(getCompareGpusPath([gpu1, gpu2]));
      const url2 = sitemapUrl(getCompareGpusPath([gpu2, gpu1]));
      const lastModTimestamp = Math.max(
        gpu1.updatedAt ?? 0,
        gpu2.updatedAt ?? 0,
      );
      const lastModification =
        lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

      entries.push({ url: url1, lastModification });
      entries.push({ url: url2, lastModification });
      totalEntries += 2;

      if (entries.length >= COMPARISONS_PER_SITEMAP) {
        const filename = GPU_COMPARISONS_FILENAME.replace(
          '{i}',
          `${fileCounter}`,
        );
        sitemapUrls.push(sitemapUrl(filename));
        await writeSitemap(sitemapPath(filename), entries);
        console.log(`Generated  ${filename} with ${entries.length} entries`);

        entries = [];
        fileCounter++;
      }
    }
  }

  if (entries.length > 0) {
    const filename = GPU_COMPARISONS_FILENAME.replace('{i}', `${fileCounter}`);
    sitemapUrls.push(sitemapUrl(filename));
    await writeSitemap(sitemapPath(filename), entries);
    console.log(`Generated ${filename} with ${entries.length} entries`);
  }

  console.log(`${totalEntries} total entries for GPU Comparison sitemaps`);

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
