import {
  AutomationAction,
  concurrent,
  ConcurrentFn,
  getAboutPath,
  getCompareCpusPath,
  getCompareGpusPath,
  getListCpusPath,
  getListGpusPath,
  getPrivacyPath,
  GetSitemapProductSlugsRequest,
  GetSitemapProductSlugsResponse,
  getViewCpuPath,
  getViewGpuPath,
  LIST_CPUS_PRESETS,
  LIST_GPUS_PRESETS,
  ProductType,
  SitemapProductSlug,
  WEBSITE_URL,
} from '@pcpartdb/shared';
import FormData from 'form-data';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as uuid from 'uuid';
import xml from 'xml';
import * as zlib from 'zlib';
import { AutomationContext } from '../types';
import { sitemapPath, sitemapUrl, websiteUrl } from '../utils/sitemap';

const DELAY_BETWEEN_UPLOAD = 4_000;
const FILES_PER_UPLOAD = 15;

const INDEX_FILENAME = 'sitemap-index.xml';
const GENERAL_FILENAME = 'sitemap-general.xml';
const CPU_LISTS_FILENAME = 'sitemap-cpu-lists.xml';
const CPU_PRODUCTS_FILENAME = 'sitemap-cpu-products-{i}.xml';
const CPU_COMPARISONS_FILENAME = 'sitemap-cpu-comparisons-{i}.xml';
const GPU_LISTS_FILENAME = 'sitemap-gpu-lists.xml';
const GPU_CHIPSETS_FILENAME = 'sitemap-gpu-chipsets-{i}.xml';
const GPU_RETAIL_MODELS_FILENAME = 'sitemap-gpu-retail-models-{i}.xml';
const GPU_COMPARISONS_FILENAME = 'sitemap-gpu-comparisons-{i}.xml';

interface SitemapIndexEntry {
  url: string;
  lastModification?: Date;
}

interface SitemapEntry {
  url: string;
  lastModification?: Date;
}

export async function updateSitemapsAction(
  action: AutomationAction,
  context: AutomationContext,
) {
  // Fetch cpu slugs
  const cpuSlugs = await fetchProductSlugs(
    { productType: ProductType.Cpu },
    context,
  );

  // Fetch gpu chipset slugs
  const gpuChipsetSlugs = await fetchProductSlugs(
    { productType: ProductType.Gpu, hasParent: false },
    context,
  );

  // Fetch gpu retail model slugs
  const gpuRetailModelSlugs = await fetchProductSlugs(
    { productType: ProductType.Gpu, hasParent: true },
    context,
  );

  // Construct sitemaps
  await removeExistingSitemaps();
  const sitemapIndexEntries = [
    await writeGeneralSitemap(),
    await writeCpuListsSitemap(),
    await writeGpuListsSitemap(),
    ...(await writeCpusSitemap(cpuSlugs)),
    ...(await writeCpuComparisonsSitemap(cpuSlugs)),
    ...(await writeGpuChipsetsSitemap(gpuChipsetSlugs)),
    ...(await writeGpuRetailModelsSitemap(gpuRetailModelSlugs)),
    ...(await writeGpuComparisonsSitemap(gpuChipsetSlugs)),
  ];
  await writeSitemapIndex(sitemapIndexEntries);

  // Upload sitemap files
  await uploadSitemaps(context);

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

  return { url: sitemapUrl(GENERAL_FILENAME, { compressed: true }) };
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

  return { url: sitemapUrl(CPU_LISTS_FILENAME, { compressed: true }) };
}

async function writeCpusSitemap(cpuSlugs: SitemapProductSlug[]) {
  console.log('Generating CPUs sitemap');

  let totalEntries = 0;
  const sitemapIndexEntries: SitemapIndexEntry[] = [];
  const entries: Record<string, SitemapEntry[]> = {};
  const lastModifications: Record<string, number> = {};

  for (let i = 0; i < cpuSlugs.length - 1; ++i) {
    const cpuSlug = cpuSlugs[i];

    const url = websiteUrl(getViewCpuPath({ slug: cpuSlug.slug }));
    const lastModTimestamp = Math.max(cpuSlug.lastModification ?? 0, 0);
    const lastModification =
      lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

    const name = getSitemapName(url, 0);
    if (!entries[name]) {
      entries[name] = [];
      lastModifications[name] = 0;
    }

    entries[name].push({ url, lastModification });
    lastModifications[name] = Math.max(
      lastModifications[name],
      lastModTimestamp,
    );
    ++totalEntries;
  }

  const sitemapNames = Object.keys(entries);
  for (const name of sitemapNames) {
    const filename = CPU_PRODUCTS_FILENAME.replace('{i}', `${name}`);
    await writeSitemap(sitemapPath(filename), entries[name]);
    const url = sitemapUrl(filename, { compressed: true });
    sitemapIndexEntries.push({
      url,
      lastModification: new Date(lastModifications[name]),
    });
    console.log(`Generated ${filename} with ${entries[name].length} entries`);
  }

  console.log(`${totalEntries} total entries for CPUs sitemaps`);

  return sitemapIndexEntries;
}

async function writeCpuComparisonsSitemap(cpuSlugs: SitemapProductSlug[]) {
  console.log('Generating CPU Comparison sitemap');

  let totalEntries = 0;
  const sitemapIndexEntries: SitemapIndexEntry[] = [];
  const entries: Record<string, SitemapEntry[]> = {};
  const lastModifications: Record<string, number> = {};

  for (let i = 0; i < cpuSlugs.length - 1; ++i) {
    for (let j = i + 1; j < cpuSlugs.length; ++j) {
      const cpuSlug1 = cpuSlugs[i];
      const cpuSlug2 = cpuSlugs[j];

      const url = websiteUrl(
        getCompareCpusPath({
          productType: ProductType.Cpu,
          comparison: [
            { id: cpuSlug1.productId, slug: cpuSlug1.slug },
            { id: cpuSlug2.productId, slug: cpuSlug2.slug },
          ],
          ordered: true,
        }),
      );
      const lastModTimestamp = Math.max(
        cpuSlug1.lastModification ?? 0,
        cpuSlug2.lastModification ?? 0,
      );
      const lastModification =
        lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

      const name = getSitemapName(url, 3);

      if (!entries[name]) {
        entries[name] = [];
        lastModifications[name] = 0;
      }

      entries[name].push({ url, lastModification });
      lastModifications[name] = Math.max(
        lastModifications[name],
        lastModTimestamp,
      );
      totalEntries += 1;
    }
  }

  const sitemapNames = Object.keys(entries);
  for (const name of sitemapNames) {
    const filename = CPU_COMPARISONS_FILENAME.replace('{i}', `${name}`);
    await writeSitemap(sitemapPath(filename), entries[name]);
    const url = sitemapUrl(filename, { compressed: true });
    sitemapIndexEntries.push({
      url,
      lastModification: new Date(lastModifications[name]),
    });
    console.log(`Generated ${filename} with ${entries[name].length} entries`);
  }

  console.log(`${totalEntries} total entries for CPU Comparison sitemaps`);

  return sitemapIndexEntries;
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

  return { url: sitemapUrl(GPU_LISTS_FILENAME, { compressed: true }) };
}

async function writeGpuChipsetsSitemap(gpuSlugs: SitemapProductSlug[]) {
  console.log('Generating GPU Chipsets sitemap');

  let totalEntries = 0;
  const sitemapIndexEntries: SitemapIndexEntry[] = [];
  const entries: Record<string, SitemapEntry[]> = {};
  const lastModifications: Record<string, number> = {};

  for (let i = 0; i < gpuSlugs.length - 1; ++i) {
    const gpuSlug = gpuSlugs[i];

    const url = websiteUrl(getViewGpuPath({ slug: gpuSlug.slug }));
    const lastModTimestamp = Math.max(gpuSlug.lastModification ?? 0, 0);
    const lastModification =
      lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

    const name = getSitemapName(url, 0);
    if (!entries[name]) {
      entries[name] = [];
      lastModifications[name] = 0;
    }

    entries[name].push({ url, lastModification });
    lastModifications[name] = Math.max(
      lastModifications[name],
      lastModTimestamp,
    );
    ++totalEntries;
  }

  const sitemapNames = Object.keys(entries);
  for (const name of sitemapNames) {
    const filename = GPU_CHIPSETS_FILENAME.replace('{i}', `${name}`);
    await writeSitemap(sitemapPath(filename), entries[name]);
    const url = sitemapUrl(filename, { compressed: true });
    sitemapIndexEntries.push({
      url,
      lastModification: new Date(lastModifications[name]),
    });
    console.log(`Generated ${filename} with ${entries[name].length} entries`);
  }

  console.log(`${totalEntries} total entries for GPU chipsets sitemaps`);

  return sitemapIndexEntries;
}

async function writeGpuRetailModelsSitemap(gpuSlugs: SitemapProductSlug[]) {
  console.log('Generating GPU Retail Models sitemap');

  let totalEntries = 0;
  const sitemapIndexEntries: SitemapIndexEntry[] = [];
  const entries: Record<string, SitemapEntry[]> = {};
  const lastModifications: Record<string, number> = {};

  for (let i = 0; i < gpuSlugs.length - 1; ++i) {
    const gpuSlug = gpuSlugs[i];

    const url = websiteUrl(getViewGpuPath({ slug: gpuSlug.slug }));
    const lastModTimestamp = Math.max(gpuSlug.lastModification ?? 0, 0);
    const lastModification =
      lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

    const name = getSitemapName(url, 1);
    if (!entries[name]) {
      entries[name] = [];
      lastModifications[name] = 0;
    }

    entries[name].push({ url, lastModification });
    lastModifications[name] = Math.max(
      lastModifications[name],
      lastModTimestamp,
    );
    ++totalEntries;
  }

  const sitemapNames = Object.keys(entries);
  for (const name of sitemapNames) {
    const filename = GPU_RETAIL_MODELS_FILENAME.replace('{i}', `${name}`);
    await writeSitemap(sitemapPath(filename), entries[name]);
    const url = sitemapUrl(filename, { compressed: true });
    sitemapIndexEntries.push({
      url,
      lastModification: new Date(lastModifications[name]),
    });
    console.log(`Generated ${filename} with ${entries[name].length} entries`);
  }

  console.log(`${totalEntries} total entries for GPU Retail Models sitemaps`);

  return sitemapIndexEntries;
}

async function writeGpuComparisonsSitemap(gpuSlugs: SitemapProductSlug[]) {
  console.log('Generating GPU Comparison sitemap');

  let totalEntries = 0;
  const sitemapIndexEntries: SitemapIndexEntry[] = [];
  const entries: Record<string, SitemapEntry[]> = {};
  const lastModifications: Record<string, number> = {};

  for (let i = 0; i < gpuSlugs.length - 1; ++i) {
    for (let j = i + 1; j < gpuSlugs.length; ++j) {
      const gpuSlug1 = gpuSlugs[i];
      const gpuSlug2 = gpuSlugs[j];

      const url = websiteUrl(
        getCompareGpusPath({
          productType: ProductType.Gpu,
          comparison: [
            { id: gpuSlug1.productId, slug: gpuSlug1.slug },
            { id: gpuSlug2.productId, slug: gpuSlug2.slug },
          ],
          ordered: true,
        }),
      );
      const lastModTimestamp = Math.max(
        gpuSlug1?.lastModification ?? 0,
        gpuSlug2?.lastModification ?? 0,
      );
      const lastModification =
        lastModTimestamp != 0 ? new Date(lastModTimestamp) : undefined;

      const sitemapName = getSitemapName(url, 3);

      if (!entries[sitemapName]) {
        entries[sitemapName] = [];
        lastModifications[sitemapName] = 0;
      }

      entries[sitemapName].push({ url, lastModification });
      lastModifications[sitemapName] = Math.max(
        lastModifications[sitemapName],
        lastModTimestamp,
      );
      totalEntries += 1;
    }
  }

  const sitemapNames = Object.keys(entries);
  for (const name of sitemapNames) {
    const filename = GPU_COMPARISONS_FILENAME.replace('{i}', `${name}`);
    await writeSitemap(sitemapPath(filename), entries[name]);
    const url = sitemapUrl(filename, { compressed: true });
    sitemapIndexEntries.push({
      url,
      lastModification: new Date(lastModifications[name]),
    });
    console.log(`Generated ${filename} with ${entries[name].length} entries`);
  }

  console.log(`${totalEntries} total entries for GPU Comparison sitemaps`);

  return sitemapIndexEntries;
}

// Sitemap Utils

async function writeSitemapIndex(sitemapIndexEntries: SitemapIndexEntry[]) {
  const items = sitemapIndexEntries.map((entry) =>
    generateSitemapIndexEntryObject(entry),
  );

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
  const compressedPath = `${path}.gz`;
  await fsPromises.writeFile(path, sitemapIndex, 'utf-8');
  await compressSitemap(path, compressedPath);
  console.log(`Generated sitemap index at ${compressedPath}`);
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
  await compressSitemap(path, `${path}.gz`);
}

async function removeExistingSitemaps() {
  const paths = await fsPromises.readdir(sitemapPath());
  console.log(`Removing existing ${paths} sitemaps`);
  for (const path of paths) {
    await fsPromises.rm(sitemapPath(path));
  }
}

function generateSitemapIndexEntryObject(entry: SitemapIndexEntry) {
  if (entry.lastModification != null) {
    return {
      sitemap: [
        { loc: entry.url },
        { lastmod: entry.lastModification.toISOString().split('T')[0] },
      ],
    };
  }

  return { sitemap: [{ loc: entry.url }] };
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

async function compressSitemap(path: string, output: string) {
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(zlib.createGzip({ level: 9 }))
      .pipe(fs.createWriteStream(output))
      .on('error', () => reject())
      .on('finish', () => resolve());
  });
  await fsPromises.rm(path);
}

async function fetchProductSlugs(
  request: GetSitemapProductSlugsRequest,
  context: AutomationContext,
) {
  const response = await context.api.get<GetSitemapProductSlugsResponse>(
    'website/sitemap/product-slugs',
    {},
    { params: { req: JSON.stringify(request) } },
  );
  return response.slugs;
}

async function uploadSitemaps(context: AutomationContext) {
  const files = await fsPromises.readdir(sitemapPath());
  const promises: ConcurrentFn[] = [];
  for (const file of files) {
    promises.push(() => uploadSitemap(sitemapPath(file), context));
  }
  await concurrent(promises, {
    limit: FILES_PER_UPLOAD,
    delayBetweenChunksMs: DELAY_BETWEEN_UPLOAD,
  });
}

async function uploadSitemap(path: string, context: AutomationContext) {
  try {
    const data = new FormData();
    data.append('file', fs.createReadStream(path));
    console.log(`Uploading sitemap: ${path}`);
    await context.api.post(
      'website/sitemap',
      data,
      {},
      {
        headers: { 'content-type': 'multipart/form-data' },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      },
    );
    console.log(`Uploaded ${path}`);
  } catch (err) {
    console.error(`Could not upload: ${path}`);
    console.error(err);
  }
}

function generateUuid(value: string) {
  return uuid.v3(value, '00000000-0000-0000-0000-000000000000');
}

function getSitemapName(url: string, size: number) {
  const uuid = generateUuid(url);
  return uuid.substring(0, size) || '0';
}
