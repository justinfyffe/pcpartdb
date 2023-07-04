import {
  CpuRepository,
  GpuRepository,
  mapToCpuDtos,
  mapToGpuDtos,
} from '@pcpartdb/database';
import {
  getAboutPath,
  getCompareCpusPath,
  getCompareGpusPath,
  getListCpusPath,
  getListGpusPath,
  getPrivacyPath,
  getViewCpuPath,
  getViewGpuPath,
  LIST_CPUS_PRESETS,
  LIST_GPUS_PRESETS,
  ListCpusOrder,
  ListCpusSort,
  ListGpusOrder,
  ListGpusSort,
  WEBSITE_URL,
} from '@pcpartdb/shared';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import xml from 'xml';
import * as zlib from 'zlib';
import { getDatabase } from '../shared/database';
import { sitemapPath, sitemapUrl, websiteUrl } from './utils';

const COMPARISONS_PER_SITEMAP = 49_000;
const PRODUCTS_PER_SITEMAP = 49_000;

const INDEX_FILENAME = 'sitemap-index.xml';
const GENERAL_FILENAME = 'sitemap-general.xml';
const CPU_LISTS_FILENAME = 'sitemap-cpu-lists.xml';
const CPU_PRODUCTS_FILENAME = 'sitemap-cpu-products-{i}.xml';
const CPU_COMPARISONS_FILENAME = 'sitemap-cpu-comparisons-{i}.xml';
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
    await writeCpuListsSitemap(),
    ...(await writeCpusSitemap()),
    ...(await writeCpuComparisonsSitemap()),
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
    { url: websiteUrl(getAboutPath()) },
    { url: websiteUrl(getPrivacyPath()) },
  ] as SitemapEntry[];

  await writeSitemap(sitemapPath(GENERAL_FILENAME), entries);
  console.log(`Generated ${GENERAL_FILENAME} with ${entries.length} entries`);

  return sitemapUrl(GENERAL_FILENAME, { compressed: true });
}

async function writeCpuListsSitemap() {
  console.log('Generating CPU Lists sitemap');

  const entries: SitemapEntry[] = Object.entries(LIST_CPUS_PRESETS).map(
    ([_key, preset]) => ({
      url: websiteUrl(getListCpusPath(preset)),
    }),
  );

  await writeSitemap(sitemapPath(CPU_LISTS_FILENAME), entries);
  console.log(`Generated ${CPU_LISTS_FILENAME} with ${entries.length} entries`);

  return sitemapUrl(CPU_LISTS_FILENAME, { compressed: true });
}

async function writeCpusSitemap() {
  console.log('Generating CPUs sitemap');

  const db = await getDatabase();
  const cpuRepository = new CpuRepository(db);

  const results = await cpuRepository.listAll({
    query: {
      orderBy: { sort: ListCpusSort.Name, order: ListCpusOrder.Asc },
    },
  });
  const cpus = mapToCpuDtos(results);

  let fileCounter = 0;
  let entries: SitemapEntry[] = [];
  let totalEntries = 0;
  const sitemapUrls: string[] = [];

  for (let i = 0; i < cpus.length - 1; ++i) {
    const cpu = cpus[i];

    const url = websiteUrl(getViewCpuPath(cpu));
    const lastModTimestamp = Math.max(cpu.updatedAt ?? 0, cpu.updatedAt ?? 0);
    const lastModification =
      lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

    entries.push({ url, lastModification });
    ++totalEntries;

    if (entries.length >= PRODUCTS_PER_SITEMAP) {
      const filename = CPU_PRODUCTS_FILENAME.replace('{i}', `${fileCounter}`);
      await writeSitemap(sitemapPath(filename), entries);
      sitemapUrls.push(sitemapUrl(filename, { compressed: true }));
      console.log(`Generated  ${filename} with ${entries.length} entries`);

      entries = [];
      fileCounter++;
    }
  }

  if (entries.length > 0) {
    const filename = CPU_PRODUCTS_FILENAME.replace('{i}', `${fileCounter}`);
    await writeSitemap(sitemapPath(filename), entries);
    sitemapUrls.push(sitemapUrl(filename, { compressed: true }));
    console.log(`Generated ${filename} with ${entries.length} entries`);
  }

  console.log(`${totalEntries} total entries for CPUs sitemaps`);

  return sitemapUrls;
}

async function writeCpuComparisonsSitemap() {
  console.log('Generating CPU Comparison sitemap');

  const db = await getDatabase();
  const cpuRepository = new CpuRepository(db);

  const results = await cpuRepository.listAll({
    query: {
      orderBy: { sort: ListCpusSort.ReleaseDate, order: ListCpusOrder.Desc },
    },
  });
  const cpus = mapToCpuDtos(results);

  let fileCounter = 0;
  let entries: SitemapEntry[] = [];
  let totalEntries = 0;
  const sitemapUrls: string[] = [];

  for (let i = 0; i < cpus.length - 1; ++i) {
    for (let j = i + 1; j < cpus.length; ++j) {
      const cpu1 = cpus[i];
      const cpu2 = cpus[j];

      const url1 = websiteUrl(getCompareCpusPath([cpu1, cpu2]));
      const url2 = websiteUrl(getCompareCpusPath([cpu2, cpu1]));
      const lastModTimestamp = Math.max(
        cpu1.updatedAt ?? 0,
        cpu2.updatedAt ?? 0,
      );
      const lastModification =
        lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

      entries.push({ url: url1, lastModification });
      entries.push({ url: url2, lastModification });
      totalEntries += 2;

      if (entries.length >= COMPARISONS_PER_SITEMAP) {
        const filename = CPU_COMPARISONS_FILENAME.replace(
          '{i}',
          `${fileCounter}`,
        );
        await writeSitemap(sitemapPath(filename), entries);
        sitemapUrls.push(sitemapUrl(filename, { compressed: true }));
        console.log(`Generated  ${filename} with ${entries.length} entries`);

        entries = [];
        fileCounter++;
      }
    }
  }

  if (entries.length > 0) {
    const filename = CPU_COMPARISONS_FILENAME.replace('{i}', `${fileCounter}`);
    await writeSitemap(sitemapPath(filename), entries);
    sitemapUrls.push(sitemapUrl(filename, { compressed: true }));
    console.log(`Generated ${filename} with ${entries.length} entries`);
  }

  console.log(`${totalEntries} total entries for CPU Comparison sitemaps`);

  return sitemapUrls;
}

async function writeGpuListsSitemap() {
  console.log('Generating GPU Lists sitemap');

  const entries: SitemapEntry[] = Object.entries(LIST_GPUS_PRESETS).map(
    ([_key, preset]) => ({
      url: websiteUrl(getListGpusPath(preset)),
    }),
  );

  await writeSitemap(sitemapPath(GPU_LISTS_FILENAME), entries);
  console.log(`Generated ${GPU_LISTS_FILENAME} with ${entries.length} entries`);

  return sitemapUrl(GPU_LISTS_FILENAME, { compressed: true });
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

    const url = websiteUrl(getViewGpuPath(gpu));
    const lastModTimestamp = Math.max(gpu.updatedAt ?? 0, gpu.updatedAt ?? 0);
    const lastModification =
      lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

    entries.push({ url, lastModification });
    ++totalEntries;

    if (entries.length >= PRODUCTS_PER_SITEMAP) {
      const filename = GPU_CHIPSETS_FILENAME.replace('{i}', `${fileCounter}`);
      await writeSitemap(sitemapPath(filename), entries);
      sitemapUrls.push(sitemapUrl(filename, { compressed: true }));
      console.log(`Generated  ${filename} with ${entries.length} entries`);

      entries = [];
      fileCounter++;
    }
  }

  if (entries.length > 0) {
    const filename = GPU_CHIPSETS_FILENAME.replace('{i}', `${fileCounter}`);
    await writeSitemap(sitemapPath(filename), entries);
    sitemapUrls.push(sitemapUrl(filename, { compressed: true }));
    console.log(`Generated ${filename} with ${entries.length} entries`);
  }

  console.log(`${totalEntries} total entries for GPU chipsets sitemaps`);

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

    const url = websiteUrl(getViewGpuPath(gpu));
    const lastModTimestamp = Math.max(gpu.updatedAt ?? 0, gpu.updatedAt ?? 0);
    const lastModification =
      lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

    entries.push({ url, lastModification });
    ++totalEntries;

    if (entries.length >= PRODUCTS_PER_SITEMAP) {
      const filename = GPU_RETAIL_MODELS_FILENAME.replace(
        '{i}',
        `${fileCounter}`,
      );
      await writeSitemap(sitemapPath(filename), entries);
      sitemapUrls.push(sitemapUrl(filename, { compressed: true }));
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
    await writeSitemap(sitemapPath(filename), entries);
    sitemapUrls.push(sitemapUrl(filename, { compressed: true }));
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

      const url1 = websiteUrl(getCompareGpusPath([gpu1, gpu2]));
      const url2 = websiteUrl(getCompareGpusPath([gpu2, gpu1]));
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
        await writeSitemap(sitemapPath(filename), entries);
        sitemapUrls.push(sitemapUrl(filename, { compressed: true }));
        console.log(`Generated  ${filename} with ${entries.length} entries`);

        entries = [];
        fileCounter++;
      }
    }
  }

  if (entries.length > 0) {
    const filename = GPU_COMPARISONS_FILENAME.replace('{i}', `${fileCounter}`);
    await writeSitemap(sitemapPath(filename), entries);
    sitemapUrls.push(sitemapUrl(filename, { compressed: true }));
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

  const path = sitemapPath(INDEX_FILENAME);
  await fsPromises.writeFile(path, sitemapIndex, 'utf-8');
  await compressSitemap(path);
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
  await compressSitemap(path);
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

async function compressSitemap(path: string) {
  fs.createReadStream(path)
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(`${path}.gz`));
  await fsPromises.rm(path);
}
