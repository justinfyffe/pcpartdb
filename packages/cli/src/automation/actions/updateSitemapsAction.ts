import {
  AutomationAction,
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
  ProductSlug,
  WEBSITE_URL,
} from '@pcpartdb/shared';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import xml from 'xml';
import * as zlib from 'zlib';
import { AutomationContext } from '../types';
import { sitemapPath, sitemapUrl, websiteUrl } from '../utils/sitemap';

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

export async function updateSitemapsAction(
  action: AutomationAction,
  context: AutomationContext,
) {
  // Fetch cpu slugs
  const cpuSlugs: ProductSlug[] = [];

  // Fetch gpu chipset slugs
  const gpuChipsetSlugs: ProductSlug[] = [];

  // Fetch gpu retail model slugs
  const gpuRetailModelSlugs: ProductSlug[] = [];

  // Construct sitemaps
  await removeExistingSitemaps();
  const sitemapUrls = [
    await writeGeneralSitemap(),
    await writeCpuListsSitemap(),
    ...(await writeCpusSitemap(cpuSlugs)),
    ...(await writeCpuComparisonsSitemap(cpuSlugs)),
    ...(await writeGpuChipsetsSitemap(gpuChipsetSlugs)),
    ...(await writeGpuRetailModelsSitemap(gpuRetailModelSlugs)),
    ...(await writeGpuComparisonsSitemap(gpuChipsetSlugs)),
    await writeGpuListsSitemap(),
  ];
  await writeSitemapIndex(sitemapUrls);

  // Upload sitemap gzipped file

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updateSitemapsDate: new Date().getTime(),
  };
}

// General Sitemap

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

// CPU Sitemaps

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

async function writeCpusSitemap(cpuSlugs: ProductSlug[]) {
  console.log('Generating CPUs sitemap');

  let fileCounter = 0;
  let entries: SitemapEntry[] = [];
  let totalEntries = 0;
  const sitemapUrls: string[] = [];

  for (let i = 0; i < cpuSlugs.length - 1; ++i) {
    const cpuSlug = cpuSlugs[i];

    const url = websiteUrl(getViewCpuPath(cpuSlug.slug));
    const lastModTimestamp = Math.max(cpuSlug.productModifiedAt ?? 0, 0);
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

async function writeCpuComparisonsSitemap(cpuSlugs: ProductSlug[]) {
  console.log('Generating CPU Comparison sitemap');

  let fileCounter = 0;
  let entries: SitemapEntry[] = [];
  let totalEntries = 0;
  const sitemapUrls: string[] = [];

  for (let i = 0; i < cpuSlugs.length - 1; ++i) {
    for (let j = i + 1; j < cpuSlugs.length; ++j) {
      const cpuSlug1 = cpuSlugs[i];
      const cpuSlug2 = cpuSlugs[j];

      const url1 = websiteUrl(
        getCompareCpusPath([cpuSlug1.slug, cpuSlug2.slug]),
      );
      const url2 = websiteUrl(
        getCompareCpusPath([cpuSlug2.slug, cpuSlug1.slug]),
      );
      const lastModTimestamp = Math.max(
        cpuSlug1.productModifiedAt ?? 0,
        cpuSlug2.productModifiedAt ?? 0,
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

// GPU Sitemaps

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

async function writeGpuChipsetsSitemap(gpuSlugs: ProductSlug[]) {
  console.log('Generating GPU Chipsets sitemap');

  let fileCounter = 0;
  let entries: SitemapEntry[] = [];
  let totalEntries = 0;
  const sitemapUrls: string[] = [];

  for (let i = 0; i < gpuSlugs.length - 1; ++i) {
    const gpuSlug = gpuSlugs[i];

    const url = websiteUrl(getViewGpuPath(gpuSlug.slug));
    const lastModTimestamp = Math.max(gpuSlug.productModifiedAt ?? 0, 0);
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

async function writeGpuRetailModelsSitemap(gpuSlugs: ProductSlug[]) {
  console.log('Generating GPU Retail Models sitemap');

  let fileCounter = 0;
  let entries: SitemapEntry[] = [];
  let totalEntries = 0;
  const sitemapUrls: string[] = [];

  for (let i = 0; i < gpuSlugs.length - 1; ++i) {
    const gpuSlug = gpuSlugs[i];

    const url = websiteUrl(getViewGpuPath(gpuSlug.slug));
    const lastModTimestamp = Math.max(gpuSlug.productModifiedAt ?? 0, 0);
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

async function writeGpuComparisonsSitemap(gpuSlugs: ProductSlug[]) {
  console.log('Generating GPU Comparison sitemap');

  let fileCounter = 0;
  let entries: SitemapEntry[] = [];
  let totalEntries = 0;
  const sitemapUrls: string[] = [];

  for (let i = 0; i < gpuSlugs.length - 1; ++i) {
    for (let j = i + 1; j < gpuSlugs.length; ++j) {
      const gpuSlug1 = gpuSlugs[i];
      const gpuSlug2 = gpuSlugs[j];

      const url1 = websiteUrl(
        getCompareGpusPath([gpuSlug1.slug, gpuSlug2.slug]),
      );
      const url2 = websiteUrl(
        getCompareGpusPath([gpuSlug2.slug, gpuSlug1.slug]),
      );
      const lastModTimestamp = Math.max(
        gpuSlug1.productModifiedAt ?? 0,
        gpuSlug2.productModifiedAt ?? 0,
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

// Sitemap Utils

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
