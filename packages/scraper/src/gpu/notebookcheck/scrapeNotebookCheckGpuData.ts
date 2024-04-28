import {
  BandwidthUnit,
  BenchmarkKey,
  BitUnit,
  FlopsUnit,
  formatCompanyName,
  formatMarketSegment,
  formatProductField,
  FormatProductFieldOptions,
  FrequencyUnit,
  Game,
  getBaseUnitValue,
  GpuFieldKey,
  GpuFields,
  GpuProduct,
  LengthUnit,
  MarketSegment,
  MeasurementUnit,
  MemorySizeUnit,
  NumericUnit,
  parseProductName,
  ProductBenchmark,
  ProductGame,
  ProductGameFps,
  ProductType,
  ScrapeProductResponse,
  SettingsPresetKey,
  SquareUnit,
  WattageUnit,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions, ScraperContext } from '../../types';
import { createGpuField } from '../utils';

const SPECIAL_VALUES = [];
const NULL_VALUES = ['n/a', 'none', 'unknown'];

export interface ScrapeNotebookCheckGpuDataOptions
  extends CommonScraperOptions {
  url: string;
  games?: Partial<Game>[];
}

export async function scrapeNotebookCheckGpuData(
  options: ScrapeNotebookCheckGpuDataOptions,
) {
  const { url, games, noProxy, ctx } = options;

  const response = await scraper.scrapeGet(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const { company, name } = scrapeNameAndCompany($);

  const fields = {
    ...scrapeFields($, company, ctx),
    marketSegment: getMarketSegment($, ctx),
  };

  const benchmarks = scrapeBenchmarks($);
  const productGames = scrapeGames($, games);

  const product: Partial<GpuProduct> = {
    productType: ProductType.Gpu,
    fields,
    benchmarks,
    games: productGames,
    company,
    name,
  };

  return { product } as ScrapeProductResponse;
}

function scrapeNameAndCompany($: cheerio.CheerioAPI) {
  const fullName = $('#content h1').text();
  const { company, name } = parseProductName(fullName);
  return {
    company: formatCompanyName(company),
    name: name.trim(),
  };
}

const DESKTOP_HINTS = ['desktop', 'desktops', 'nettop', 'nettops'];
const MOBILE_HINTS = [
  'laptop',
  'laptops',
  'macbook',
  'netbook',
  'netbooks',
  'notebook',
  'notebooks',
  'subnotebook',
  'subnotebooks',
  'ultrabook',
  'ultrabooks',
];
const WORKSTATION_HINTS = ['workstation', 'workstations'];
function getMarketSegment($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const segmentCounts: Record<string, number> = {
    [MarketSegment.Desktop]: 0,
    [MarketSegment.Mobile]: 0,
    [MarketSegment.Workstation]: 0,
  };
  $('#content p').each((_i, p) => {
    const text = $(p).text()?.trim()?.toLowerCase() ?? '';
    const textArr = text
      .split(' ')
      .map((value) => value.replace(/[^a-zA-Z0-9_-]/gi, ''))
      .filter((value) => value.length > 0);

    segmentCounts[MarketSegment.Desktop] = textArr.filter((value) =>
      DESKTOP_HINTS.includes(value),
    ).length;
    segmentCounts[MarketSegment.Mobile] += textArr.filter((value) =>
      MOBILE_HINTS.includes(value),
    ).length;
    segmentCounts[MarketSegment.Workstation] += textArr.filter((value) =>
      WORKSTATION_HINTS.includes(value),
    ).length;
  });

  const ordered = Object.keys(segmentCounts).sort(
    (a, b) => segmentCounts[b] - segmentCounts[a],
  );

  const marketSegment = ordered[0] as MarketSegment;
  if (segmentCounts[marketSegment] === 0) {
    return undefined;
  }

  const formatted = formatMarketSegment(marketSegment);

  return createGpuField({
    field: 'marketSegment',
    raw: marketSegment,
    formatted,
    ctx,
  });
}

interface ProductFieldScraper {
  label: string;
  regexes: RegExp[];
  unitMapper?: Record<string, MeasurementUnit>;
  formatOptions?: FormatProductFieldOptions;
  parseValue?: (results: {
    value: string;
    unit?: MeasurementUnit;
    company?: string;
  }) => unknown;
}
const FIELDS: Partial<Record<GpuFieldKey, ProductFieldScraper>> = {
  architecture: {
    label: 'architecture',
    regexes: [/(?<value>.+)/i],
  },
  cudaCores: {
    label: 'pipelines',
    regexes: [/(?<value>[.\d]+) - unified/i],
    parseValue: ({ value, company }) =>
      value != null && isCompany('nvidia', company) ? Number(value) : null,
  },
  dieSize: {
    label: 'die size',
    regexes: [/(?<value>[.\d]+) (?<unit>mm²)/i],
    unitMapper: {
      'mm²': SquareUnit.mm2,
      'μm²': SquareUnit.um2,
      'nm²': SquareUnit.nm2,
    },
    parseValue: ({ value, unit }) => {
      return getBaseUnitValue(value, unit, { decimals: 2 });
    },
  },
  executionUnits: {
    label: 'pipelines',
    regexes: [/(?<value>[.\d]+) - unified/i],
    parseValue: ({ value, company }) =>
      value != null && isCompany('intel', company) ? Number(value) : null,
  },
  fp16: {
    label: 'theoretical performance',
    regexes: [/(?<value>[.\d]+) (?<unit>GFLOPS|TFLOPS) FP16/i],
    unitMapper: {
      gflops: FlopsUnit.gflops,
      tflops: FlopsUnit.tflops,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  fp32: {
    label: 'theoretical performance',
    regexes: [/(?<value>[.\d]+) (?<unit>GFLOPS|TFLOPS) FP32/i],
    unitMapper: {
      gflops: FlopsUnit.gflops,
      tflops: FlopsUnit.tflops,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  fp64: {
    label: 'theoretical performance',
    regexes: [/(?<value>[.\d]+) (?<unit>GFLOPS|TFLOPS) FP64/i],
    unitMapper: {
      gflops: FlopsUnit.gflops,
      tflops: FlopsUnit.tflops,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  gpuCoreBaseClock: {
    label: 'core speed',
    regexes: [
      /^(?<value>[.\d]+) - .* (?<unit>KHz|MHz|GHz)/i,
      /^(?<value>[.\d]+) (?<unit>KHz|MHz|GHz)/i,
    ],
    unitMapper: {
      khz: FrequencyUnit.khz,
      mhz: FrequencyUnit.mhz,
      ghz: FrequencyUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  gpuCoreBoostClock: {
    label: 'core speed',
    regexes: [/(?<value>[.\d]+) \(boost\) (?<unit>KHz|MHz|GHz)/i],
    unitMapper: {
      khz: FrequencyUnit.khz,
      mhz: FrequencyUnit.mhz,
      ghz: FrequencyUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  l1Cache: {
    label: 'cache',
    regexes: [/L1: (?<value>[.\d]+) (?<unit>KB|MB|GB)/i],
    unitMapper: {
      kb: MemorySizeUnit.kb,
      mb: MemorySizeUnit.mb,
      gb: MemorySizeUnit.gb,
      tb: MemorySizeUnit.tb,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  l2Cache: {
    label: 'cache',
    regexes: [/L2: (?<value>[.\d]+) (?<unit>KB|MB|GB)/i],
    unitMapper: {
      kb: MemorySizeUnit.kb,
      mb: MemorySizeUnit.mb,
      gb: MemorySizeUnit.gb,
      tb: MemorySizeUnit.tb,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  memoryBandwidth: {
    label: 'memory bandwidth',
    regexes: [/(?<value>[.\d]+) (?<unit>KB\/s|MB\/s|GB\/s)/i],
    unitMapper: {
      'kb/s': BandwidthUnit.kbps,
      'mb/s': BandwidthUnit.mbps,
      'gb/s': BandwidthUnit.gbps,
      'tb/s': BandwidthUnit.tbps,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  memoryClock: {
    label: 'memory speed',
    regexes: [/(?<value>[.\d]+) (?<unit>KHz|MHz|GHz)$/i],
    unitMapper: {
      khz: FrequencyUnit.khz,
      mhz: FrequencyUnit.mhz,
      ghz: FrequencyUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  memoryClockEffective: {
    label: 'memory speed',
    regexes: [/^(?<value>[.\d]+) effective .+ (?<unit>KHz|MHz|GHz)/i],
    unitMapper: {
      khz: FrequencyUnit.khz,
      mhz: FrequencyUnit.mhz,
      ghz: FrequencyUnit.ghz,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  memoryInterface: {
    label: 'memory bus width',
    regexes: [/(?<value>[.\d]+) (?<unit>Bit)/i],
    unitMapper: {
      bit: BitUnit.bit,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  memorySize: {
    label: 'max. amount of memory',
    regexes: [/(?<value>[.\d]+) (?<unit>KB|MB|GB)/i],
    unitMapper: {
      kb: MemorySizeUnit.kb,
      mb: MemorySizeUnit.mb,
      gb: MemorySizeUnit.gb,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  memoryType: {
    label: 'memory type',
    regexes: [/(?<value>.+)/i],
  },
  openClVersion: {
    label: 'api',
    regexes: [/OpenCL (?<value>[.\d]+)/i],
  },
  openGlVersion: {
    label: 'api',
    regexes: [/OpenGL (?<value>[.\d]+)/i],
  },
  processSize: {
    label: 'technology',
    regexes: [/(?<value>[.\d]+) (?<unit>μm|nm)/i],
    unitMapper: {
      μm: LengthUnit.um,
      nm: LengthUnit.nm,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  rops: {
    label: 'rops',
    regexes: [/(?<value>[.\d]+)/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  rtCores: {
    label: 'raytracing cores',
    regexes: [/(?<value>[.\d]+)/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  shaderModelVersion: {
    label: 'api',
    regexes: [/Shader (?<value>[.\d]+)/i],
  },
  streamProcessors: {
    label: 'pipelines',
    regexes: [/(?<value>[.\d]+) - unified/i],
    parseValue: ({ value, company }) =>
      value != null && isCompany('amd', company) ? Number(value) : null,
  },
  shadingUnits: {
    label: 'pipelines',
    regexes: [/(?<value>[.\d]+) - unified/i],
    parseValue: ({ value, company }) =>
      value != null && isCompany('ati', company) ? Number(value) : null,
  },
  tdp: {
    label: 'power consumption',
    regexes: [/(?<value>[.\d]+) (?<unit>Watt)/i],
    unitMapper: {
      watt: WattageUnit.w,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  tensorCores: {
    label: 'tensor / ai cores',
    regexes: [/(?<value>[.\d]+)/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  tmus: {
    label: 'tmus',
    regexes: [/(?<value>[.\d]+)/i],
    parseValue: ({ value }) => (value != null ? Number(value) : null),
  },
  transistors: {
    label: 'transistor count',
    regexes: [/(?<value>[.\d]+) (?<unit>Million|Billion)/i],
    unitMapper: {
      million: NumericUnit.million,
      billion: NumericUnit.billion,
    },
    parseValue: ({ value, unit }) =>
      getBaseUnitValue(value, unit, { decimals: 2 }),
  },
  vulkanVersion: {
    label: 'api',
    regexes: [/Vulkan (?<value>[.\d]+)/i],
  },
};
function scrapeFields(
  $: cheerio.CheerioAPI,
  company: string | null,
  ctx: ScraperContext,
) {
  const fields = Object.entries(FIELDS).map(([fieldKey, scraper]) => {
    const scraped = scrapeSpecRow($, scraper.label) || null;

    let scrapedValue: string = null;
    let scrapedUnit: string = null;
    for (const regex of scraper.regexes) {
      const results = scraped?.[0]?.match(regex);
      if (results != null && results.length > 1) {
        scrapedValue = results?.[1]?.trim() ?? null;
        scrapedUnit = results?.[2]?.toLowerCase()?.trim() ?? null;
        break;
      }
    }

    const unit = scraper.unitMapper?.[scrapedUnit] ?? null;

    const raw = scraper.parseValue
      ? scraper.parseValue({ value: scrapedValue, unit, company })
      : scrapedValue;
    const formatted = formatProductField(
      ProductType.Gpu,
      fieldKey as GpuFieldKey,
      raw,
      { ...(scraper.formatOptions ?? {}), displayUnit: unit },
    );

    return createGpuField({
      field: fieldKey as GpuFieldKey,
      raw: raw ?? null,
      formatted: formatted ?? null,
      ctx,
    });
  });

  return fields.reduce((acc, field) => {
    return field?.meta?.fieldKey
      ? { ...acc, [field.meta.fieldKey]: field }
      : acc;
  }, {} as GpuFields);
}

const BENCHMARKS = {
  [BenchmarkKey._3dMark_2001SE_Standard]:
    '3DMark 2001SE - 3DMark 2001 - Standard',
  [BenchmarkKey._3dMark_03_Standard]: '3DMark 03 - 3DMark 03 - Standard',
  [BenchmarkKey._3dMark_05_Standard]: '3DMark 05 - 3DMark 05 - Standard',
  [BenchmarkKey._3dMark_06_Standard]: '3DMark 06',
  [BenchmarkKey._3dMark_11_Performance_Gpu]:
    '3DMark 11 - 3DM11 Performance GPU',
  [BenchmarkKey._3dMark_11_Performance_Score]:
    '3DMark 11 - 3DM11 Performance Score',
  [BenchmarkKey._3dMark_Cloud_Gate_Graphics]:
    '3DMark - 3DMark Cloud Gate Graphics',
  [BenchmarkKey._3dMark_Cloud_Gate_Score]: '3DMark - 3DMark Cloud Gate Score',
  [BenchmarkKey._3dMark_Fire_Strike_Standard_Graphics]:
    '3DMark - 3DMark Fire Strike Standard Graphics',
  [BenchmarkKey._3dMark_Fire_Strike_Standard_Score]:
    '3DMark - 3DMark Fire Strike Standard Score',
  [BenchmarkKey._3dMark_Ice_Storm_Extreme_Graphics]:
    '3DMark - 3DMark Ice Storm Extreme Graphics',
  [BenchmarkKey._3dMark_Ice_Storm_Graphics]:
    '3DMark - 3DMark Ice Storm Graphics',
  [BenchmarkKey._3dMark_Ice_Storm_Unlimited_Graphics]:
    '3DMark - 3DMark Ice Storm Unlimited Graphics',
  [BenchmarkKey._3dMark_Night_Raid_Score]: '3DMark - 3DMark Night Raid',
  [BenchmarkKey._3dMark_Night_Raid_Graphics]:
    '3DMark - 3DMark Night Raid Graphics Score',
  [BenchmarkKey._3dMark_Timespy_Graphics]: '3DMark - 3DMark Time Spy Graphics',
  [BenchmarkKey._3dMark_Timespy_Score]: '3DMark - 3DMark Time Spy Score',
  [BenchmarkKey._3dMark_Vantage_Perf]: '3DMark Vantage - 3DM Vant. Perf. total',
  [BenchmarkKey._3dMark_Wild_Life_Extreme_Unlimited]:
    '3DMark - 3DMark Wild Life Extreme Unlimited',
  [BenchmarkKey._3dMark_Wild_Life_Unlimited]:
    '3DMark - 3DMark Wild Life Unlimited',

  [BenchmarkKey.Blender_3_3_Classroom_Cuda]:
    'Blender - Blender 3.3 Classroom CUDA *',
  [BenchmarkKey.Blender_3_3_Classroom_Hip]:
    'Blender - Blender 3.3 Classroom HIP *',
  [BenchmarkKey.Blender_3_3_Classroom_Metal]:
    'Blender - Blender 3.3 Classroom METAL *',
  [BenchmarkKey.Blender_3_3_Classroom_Optix]:
    'Blender - Blender 3.3 Classroom OPTIX *',

  [BenchmarkKey.Cinebench_R10_Shading_32_Bit]:
    'Cinebench R10 - Cinebench R10 Shading (32bit)',
  [BenchmarkKey.Cinebench_R11_5_OpenGl_64_Bit]:
    'Cinebench R11.5 - Cinebench R11.5 OpenGL 64 Bit',
  [BenchmarkKey.Cinebench_R15_OpenGl_64_Bit]:
    'Cinebench R15 - Cinebench R15 OpenGL 64 Bit',

  [BenchmarkKey.ComputeMark_2_1_Result]:
    'ComputeMark v2.1 - ComputeMark v2.1 Result',

  [BenchmarkKey.Geekbench_6_2_Gpu_OpenCl]:
    'Geekbench 6.2 - Geekbench 6.2 GPU OpenCL',
  [BenchmarkKey.Geekbench_6_2_Gpu_Vulkan]:
    'Geekbench 6.2 - Geekbench 6.2 GPU Vulkan',

  [BenchmarkKey.LuxMark_2_0_Room_Gpu]:
    'LuxMark v2.0 64Bit - LuxMark v2.0 Room GPU',
  [BenchmarkKey.LuxMark_2_0_Sala_Gpu]:
    'LuxMark v2.0 64Bit - LuxMark v2.0 Sala GPU',

  [BenchmarkKey.Specvp11_Catia_03]: 'SPECviewperf 11 - specvp11 catia-03',
  [BenchmarkKey.Specvp11_Ensight_04]: 'SPECviewperf 11 - specvp11 ensight-04',
  [BenchmarkKey.Specvp11_Lightwave_01]:
    'SPECviewperf 11 - specvp11 lightwave-01',
  [BenchmarkKey.Specvp11_Maya_03]: 'SPECviewperf 11 - specvp11 maya-03',
  [BenchmarkKey.Specvp11_Proe_05]: 'SPECviewperf 11 - specvp11 proe-05',
  [BenchmarkKey.Specvp11_Snx_01]: 'SPECviewperf 11 - specvp11 snx-01',
  [BenchmarkKey.Specvp11_Sw_02]: 'SPECviewperf 11 - specvp11 sw-02',
  [BenchmarkKey.Specvp11_Tcvis_02]: 'SPECviewperf 11 - specvp11 tcvis-02',

  [BenchmarkKey.Specvp12_3dsMax_05]: 'SPECviewperf 12 - specvp12 3dsmax-05',
  [BenchmarkKey.Specvp12_Catia_04]: 'SPECviewperf 12 - specvp12 catia-04',
  [BenchmarkKey.Specvp12_Creo_01]: 'SPECviewperf 12 - specvp12 creo-01',
  [BenchmarkKey.Specvp12_Energy_01]: 'SPECviewperf 12 - specvp12 energy-01',
  [BenchmarkKey.Specvp12_Maya_04]: 'SPECviewperf 12 - specvp12 maya-04',
  [BenchmarkKey.Specvp12_Medical_01]: 'SPECviewperf 12 - specvp12 mediacal-01',
  [BenchmarkKey.Specvp12_Showcase_01]: 'SPECviewperf 12 - specvp12 showcase-01',
  [BenchmarkKey.Specvp12_Snx_02]: 'SPECviewperf 12 - specvp12 snx-02',
  [BenchmarkKey.Specvp12_Sw_03]: 'SPECviewperf 12 - specvp12 sw-03',

  [BenchmarkKey.Specvp13_3dsMax_06]: 'SPECviewperf 13 - specvp13 3dsmax-06',
  [BenchmarkKey.Specvp13_Catia_05]: 'SPECviewperf 13 - specvp13 catia-05',
  [BenchmarkKey.Specvp13_Creo_02]: 'SPECviewperf 13 - specvp13 creo-02',
  [BenchmarkKey.Specvp13_Energy_02]: 'SPECviewperf 13 - specvp13 energy-02',
  [BenchmarkKey.Specvp13_Maya_05]: 'SPECviewperf 13 - specvp13 maya-05',
  [BenchmarkKey.Specvp13_Medical_02]: 'SPECviewperf 13 - specvp13 medical-02',
  [BenchmarkKey.Specvp13_Showcase_02]: 'SPECviewperf 13 - specvp13 showcase-02',
  [BenchmarkKey.Specvp13_Snx_03]: 'SPECviewperf 13 - specvp13 snx-03',
  [BenchmarkKey.Specvp13_Sw_04]: 'SPECviewperf 13 - specvp13 sw-04',

  [BenchmarkKey.Specvp2020_3dsMax_07_4k]:
    'SPECviewperf 2020 v1 - specvp2020 3dsmax-07 4k',
  [BenchmarkKey.Specvp2020_Catia_06_4k]:
    'SPECviewperf 2020 v1 - specvp2020 catia-06 4k',
  [BenchmarkKey.Specvp2020_Creo_03_4k]:
    'SPECviewperf 2020 v1 - specvp2020 creo-03 4k',
  [BenchmarkKey.Specvp2020_Energy_03_4k]:
    'SPECviewperf 2020 v1 - specvp2020 energy-03 4k',
  [BenchmarkKey.Specvp2020_Maya_06_4k]:
    'SPECviewperf 2020 v1 - specvp2020 maya-06 4k',
  [BenchmarkKey.Specvp2020_Medical_03_4k]:
    'SPECviewperf 2020 v1 - specvp2020 medical-03 4k',
  [BenchmarkKey.Specvp2020_Snx_03_4k]:
    'SPECviewperf 2020 v1 - specvp2020 snx-04 4k',
  [BenchmarkKey.Specvp2020_Sw_05_4k]:
    'SPECviewperf 2020 v1 - specvp2020 solidworks-05 4k',

  [BenchmarkKey.UnigineValley_1_0_Dx]:
    'Unigine Valley 1.0 - Unigine Valley 1.0 DX',
  [BenchmarkKey.UnigineHeaven_2_1_High]: 'Unigine Heaven 2.1 - Heaven 2.1 high',
  [BenchmarkKey.UnigineHeaven_3_0_Dx_11]:
    'Unigine Heaven 3.0 - Unigine Heaven 3.0 DX 11',
  [BenchmarkKey.UnigineHeaven_3_0_OpenGl]:
    'Unigine Heaven 3.0 - Unigine Heaven 3.0 OpenGL',
};
const BENCHMARK_REGEXES = [/median:\s+([.\d]+)/i, /^([.\d]+)/i];
function scrapeBenchmarks($: cheerio.CheerioAPI) {
  const rand = Math.floor(Math.random() * 2);
  const benchmarks = Object.entries(BENCHMARKS).map(([key, textToSearch]) => {
    // Scrape benchmark
    const benchmarkValues = scrapeBenchmark($, textToSearch);

    // Parse benchmark
    let benchmark = null;
    const benchmarkString = benchmarkValues.join(' ');
    for (const regex of BENCHMARK_REGEXES) {
      const results = benchmarkString.match(regex);
      const value = results?.[1] != null ? Number(results[1]) : null;
      benchmark = benchmark ?? value;

      // Get first benchmark value.
      if (benchmark != null) {
        // const factor = 1.5;
        // if (rand) {
        //   const b = (Math.random() / 100) * factor;
        //   const after = Number(benchmark * (1 + b)).toFixed(0);
        //   benchmark = Number(after);
        // } else {
        //   const b = (Math.random() / 100) * factor;
        //   const after = Number(benchmark * (1 - b)).toFixed(0);
        //   benchmark = Number(after);
        // }

        break;
      }
    }
    return { key, benchmark };
  });

  // Convert to product benchmarks;
  return benchmarks
    .filter((benchmark) => benchmark?.benchmark != null)
    .map((benchmark) => {
      return {
        benchmarkKey: benchmark.key,
        value: benchmark.benchmark,
        metadata: null,
      } as ProductBenchmark;
    });
}

function scrapeGames($: cheerio.CheerioAPI, games: Partial<Game>[]) {
  const productGames: ProductGame[] = [];
  for (const game of games) {
    const productGame = scrapeGameFps($, game);
    if (productGame) {
      productGames.push(productGame);
    }
  }
  productGames.sort((pg1, pg2) =>
    (pg2?.game?.releaseDate ?? '').localeCompare(pg1?.game?.releaseDate ?? ''),
  );
  return productGames;
}

function scrapeSpecRow($: cheerio.CheerioAPI, label: string) {
  const el = $('td.caption')
    .filter(
      (_i, td) => $(td).text().trim().toLowerCase() === label.toLowerCase(),
    )
    .siblings('td')
    .first();

  if (el.has('br')) {
    el.find('br').replaceWith(';;');
  }
  if (el.has('s')) {
    el.find('s').replaceWith(';;');
  }

  const values = el
    .text()
    .split(';;')
    .map((val) => val.trim());

  return values
    .filter((value) => !!value)
    .filter((value) => !NULL_VALUES.includes(value.toLowerCase()));
}

function scrapeBenchmark($: cheerio.CheerioAPI, label: string) {
  const el = $('.gpubench_benchmark')
    .filter(
      (_i, div) => $(div).text().trim().toLowerCase() === label.toLowerCase(),
    )
    .siblings('div')
    .first();

  if (!el.has('.paintAB_legend')) {
    return null;
  }

  const values = el
    .find('.paintAB_legend')
    .text()
    .split(/\s\s/)
    .map((value) => value.trim())
    .filter((value) => !!value);

  return values;
}

function scrapeGameFps($: cheerio.CheerioAPI, game: Partial<Game>) {
  const presetsOrder = [
    SettingsPresetKey.Low,
    SettingsPresetKey.Medium,
    SettingsPresetKey.High,
    SettingsPresetKey.Ultra,
    SettingsPresetKey.QHD,
    SettingsPresetKey._4K_UHD,
  ];

  const scraperName = game.scraperOptions?.notebookCheckName;
  const el = $('.contenttable.fpstable th').filter(
    (_i, th) =>
      $(th).text().trim()?.toLowerCase() === scraperName?.toLowerCase(),
  );

  const cells = el
    .siblings('td')
    .map((_i, td) => $(td).text() || '')
    .toArray();

  if (!cells.length) {
    return null;
  }

  const gameId = game.id;
  const productGame: ProductGame = { gameId, game, fps: [] };
  for (let i = 0; i < cells.length; ++i) {
    const cell = cells[i];
    const fps = Number(cell);
    if (Number.isNaN(fps) || !fps) {
      continue;
    }

    productGame.fps.push({ gameId, settingsPresetKey: presetsOrder[i], fps });
  }

  return productGame;
}

function isCompany(companyToCheck: string, company: string) {
  const lcCompany = company?.toLowerCase();
  const lcCompanyToCheck = companyToCheck.toLowerCase();
  return lcCompany === lcCompanyToCheck;
}
