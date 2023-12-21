import {
  BenchmarkKey,
  CpuProduct,
  formatProductName,
  getProductPerformanceRank,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  productFieldFormattedValue,
} from '@pcpartdb/shared';

// TODO: use user preferred benchmark
const PREFERRED_BENCHMARK = BenchmarkKey.PassMark_CpuMark_Multi_Thread;

const introData = (cpu: CpuProduct) => {
  return [
    { description: 'cpu name', value: formatProductName(cpu) },
    { description: 'company', value: cpu?.company },
    {
      description: 'market segment',
      value: productFieldFormattedValue(cpu?.fields?.marketSegment),
    },
    {
      description: 'release date',
      value: productFieldFormattedValue(cpu?.fields?.releaseDate),
    },
    {
      description: 'msrp',
      value: productFieldFormattedValue(cpu?.fields?.msrp),
    },
    {
      description: 'production status',
      value: productFieldFormattedValue(cpu?.fields?.productionStatus),
    },
    {
      description: 'architecture',
      value: productFieldFormattedValue(cpu?.fields?.architecture),
    },
    {
      description: 'generation',
      value: productFieldFormattedValue(cpu?.fields?.generation),
    },
  ] as { description: string; value: string }[];
};

const specsData = (cpu: CpuProduct) => {
  return [
    {
      description: 'cores',
      value: productFieldFormattedValue(cpu?.fields?.cores),
    },
    {
      description: 'performance cores',
      value: productFieldFormattedValue(cpu?.fields?.pCores),
    },
    {
      description: 'efficient cores',
      value: productFieldFormattedValue(cpu?.fields?.eCores),
    },
    {
      description: 'threads',
      value: productFieldFormattedValue(cpu?.fields?.threads),
    },
    {
      description: 'generation',
      value: productFieldFormattedValue(cpu?.fields?.generation),
    },
    {
      description: 'architecture',
      value: productFieldFormattedValue(cpu?.fields?.architecture),
    },
    {
      description: 'process size',
      value: productFieldFormattedValue(cpu?.fields?.processSize),
    },
    {
      description: 'socket',
      value: productFieldFormattedValue(cpu?.fields?.generation),
    },
    {
      description: 'integrated graphics',
      value: productFieldFormattedValue(cpu?.fields?.integratedGraphics),
    },
    {
      description: 'bundled cooler',
      value: productFieldFormattedValue(cpu?.fields?.integratedGraphics),
    },
    {
      description: 'clock',
      value: productFieldFormattedValue(cpu?.fields?.clock),
    },
    {
      description: 'turbo clock',
      value: productFieldFormattedValue(cpu?.fields?.turboClock),
    },
    {
      description: 'unlocked multiplier',
      value: productFieldFormattedValue(cpu?.fields?.multiplierUnlocked),
    },
    {
      description: 'l1 cache',
      value: productFieldFormattedValue(cpu?.fields?.l1Cache),
    },
    {
      description: 'l2 cache',
      value: productFieldFormattedValue(cpu?.fields?.l2Cache),
    },
    {
      description: 'l3 cache',
      value: productFieldFormattedValue(cpu?.fields?.l3Cache),
    },
    {
      description: 'memory support',
      value: productFieldFormattedValue(cpu?.fields?.memorySupport),
    },
    {
      description: 'memory channels',
      value: productFieldFormattedValue(cpu?.fields?.memoryChannels),
    },
    {
      description: 'pci express',
      value: productFieldFormattedValue(cpu?.fields?.pciExpress),
    },
    {
      description: 'tdp',
      value: productFieldFormattedValue(cpu?.fields?.tdp),
    },
  ] as { description: string; value: string }[];
};

const performanceData = (cpu: CpuProduct, preferredBenchmark: BenchmarkKey) => {
  return [
    {
      description: 'performance rank',
      value: getProductPerformanceRank(cpu, PREFERRED_BENCHMARK),
    },
    {
      description: 'performance rating',
      value: productBenchmarkValue(cpu, preferredBenchmark),
    },
    {
      description: 'value rating',
      value: productBenchmarkValuePerMsrp(cpu, preferredBenchmark),
    },
    {
      description: 'best performing cpu name',
      value: 'BEST CPU PLACEHOLDER',
    },
  ] as { description: string; value: string }[];
};

const aiPromptTemplate = (
  cpu: CpuProduct,
  preferredBenchmark: BenchmarkKey,
) => {
  const intro = introData(cpu)
    .filter((v) => v.value)
    .map((v) => `${v.description},"${v.value}"`);
  const specs = specsData(cpu)
    .filter((v) => v.value)
    .map((v) => `${v.description},"${v.value}"`);
  const performance = performanceData(cpu, preferredBenchmark)
    .filter((v) => v.value)
    .map((v) => `${v.description},"${v.value}"`);

  return `
***** START INTRO CSV DATA *****
description,value
${intro.join('\n')}
***** END INTRO CSV DATA *****
***** START SPECS CSV DATA *****
description,value
${specs.join('\n')}
***** END SPECS CSV DATA *****
***** START PERFORMANCE CSV DATA *****
description,value
${performance.join('\n')}
***** END PERFORMANCE CSV DATA *****
***** START PERFOMRANCE DETAILS TO INCLUDE *****
1. Performance rating is our estimate of how it performs compares to the best performing CPU in our database.
2. Value rating is based on the performance per dollar compared to other CPUs in the database.
***** END PERFOMRANCE DETAILS TO INCLUDE *****
***** START SUMMARY INSTRUCTIONS *****
1. Write an unbiased summary about the CPU using only the provided CSV data and details to include above. Do not include other data.
2. Do not write a review.
3. Do not write bullet points or lists. Do not write headings. Only write paragraphs.
4. THe summary should be approximately 400 words long.
5. The summary target 4-5 paragraphs if possible.
6. There should be an intro, 2-3 paragraphs about specs, and a performance paragraph.
7. Each paragraph should be brief, only a few sentences based on the data above.
8. Include additional descriptors that apply. For example, "small", "large", "high-end", "low-end".
***** END SUMMARY INSTRUCTIONS *****
`.trim();
};

export function getCpuAiPrompt(
  cpu: CpuProduct,
  preferredBenchmark: BenchmarkKey,
) {
  return aiPromptTemplate(cpu, preferredBenchmark);
}
