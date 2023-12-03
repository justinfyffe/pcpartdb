import {
  formatGpuDimensions,
  formatProductName,
  GpuProduct,
  hasProductFieldValue,
  productFieldFormattedValue,
  productRankValue,
  RankKey,
} from '@pcpartdb/shared';

const introData = (gpu: GpuProduct) => {
  return [
    { description: 'gpu name', value: formatProductName(gpu) },
    { description: 'company', value: gpu?.company },
    {
      description: 'market segment',
      value: productFieldFormattedValue(gpu?.fields?.marketSegment),
    },
    {
      description: 'release date',
      value: productFieldFormattedValue(gpu?.fields?.releaseDate),
    },
    {
      description: 'msrp',
      value: productFieldFormattedValue(gpu?.fields?.msrp),
    },
    {
      description: 'codename',
      value: productFieldFormattedValue(gpu?.fields?.codename),
    },
    {
      description: 'architecture',
      value: productFieldFormattedValue(gpu?.fields?.architecture),
    },
    {
      description: 'process size',
      value: productFieldFormattedValue(gpu?.fields?.processSize),
    },
    {
      description: 'production status',
      value: productFieldFormattedValue(gpu?.fields?.productionStatus),
    },
  ] as { description: string; value: string }[];
};

const performanceData = (gpu: GpuProduct) => {
  return [
    {
      description: 'performance rank',
      value: productRankValue(gpu, RankKey.PerformanceRating),
    },
    {
      description: 'performance rating',
      value: productFieldFormattedValue(gpu?.fields?.performanceRating),
    },
    {
      description: 'value rating',
      value: productFieldFormattedValue(gpu?.fields?.performancePerMsrp),
    },
    {
      description: 'best performing gpu name',
      value: 'BEST GPU PLACEHOLDER',
    },
    {
      description: 'performance compared to best performaning gpu',
      value: hasProductFieldValue(gpu?.fields?.performanceRating)
        ? `${productFieldFormattedValue(gpu?.fields?.performanceRating)}%`
        : null,
    },
  ] as { description: string; value: string }[];
};

const memoryData = (gpu: GpuProduct) => {
  return [
    {
      description: 'memory size',
      value: productFieldFormattedValue(gpu?.fields?.memorySize),
    },
    {
      description: 'memory type',
      value: productFieldFormattedValue(gpu?.fields?.memoryType),
    },
    {
      description: 'memory clock',
      value: productFieldFormattedValue(gpu?.fields?.memoryClock),
    },
    {
      description: 'effective memory clock',
      value: productFieldFormattedValue(gpu?.fields?.memoryClockEffective),
    },
    {
      description: 'memory interface',
      value: productFieldFormattedValue(gpu?.fields?.memoryInterface),
    },
    {
      description: 'memory bandwidth',
      value: productFieldFormattedValue(gpu?.fields?.memoryBandwidth),
    },
  ] as { description: string; value: string }[];
};

const coresClockData = (gpu: GpuProduct) => {
  return [
    {
      description: 'cores',
      value: productFieldFormattedValue(gpu?.fields?.gpuCores),
    },
    {
      description: 'compute units',
      value: productFieldFormattedValue(gpu?.fields?.computeUnits),
    },
    {
      description: 'texture mapping units',
      value: productFieldFormattedValue(gpu?.fields?.tmus),
    },
    {
      description: 'render output units',
      value: productFieldFormattedValue(gpu?.fields?.rops),
    },
    {
      description: 'tensor cores',
      value: productFieldFormattedValue(gpu?.fields?.tensorCores),
    },
    {
      description: 'ray tracing cores',
      value: productFieldFormattedValue(gpu?.fields?.rtCores),
    },
    {
      description: 'core clock speed',
      value: productFieldFormattedValue(gpu?.fields?.gpuCoreBaseClock),
    },
    {
      description: 'boost clock speed',
      value: productFieldFormattedValue(gpu?.fields?.gpuCoreBoostClock),
    },
  ] as { description: string; value: string }[];
};

const compatibilityData = (gpu: GpuProduct) => {
  return [
    {
      description: 'suggested psu',
      value: productFieldFormattedValue(gpu?.fields?.suggestedPsu),
    },
    {
      description: 'slot width',
      value: productFieldFormattedValue(gpu?.fields?.slotWidth),
    },
    { description: 'dimensions', value: formatGpuDimensions(gpu) },
  ] as { description: string; value: string }[];
};

const aiPromptTemplate = (gpu: GpuProduct) => {
  const intro = introData(gpu)
    .filter((v) => v.value)
    .map((v) => `${v.description},"${v.value}"`);
  const performance = performanceData(gpu)
    .filter((v) => v.value)
    .map((v) => `${v.description},"${v.value}"`);
  const memory = memoryData(gpu)
    .filter((v) => v.value)
    .map((v) => `${v.description},"${v.value}"`);
  const coresClock = coresClockData(gpu)
    .filter((v) => v.value)
    .map((v) => `${v.description},"${v.value}"`);
  const compatibility = compatibilityData(gpu)
    .filter((v) => v.value)
    .map((v) => `${v.description},"${v.value}"`);

  return `
***** START INTRO CSV DATA *****
description,value
${intro.join('\n')}
***** END INTRO CSV DATA *****
***** START PERFORMANCE CSV DATA *****
description,value
${performance.join('\n')}
***** END PERFORMANCE CSV DATA *****
***** START MEMORY CSV DATA *****
description,value
${memory.join('\n')}
***** END MEMORY CSV DATA *****
***** START CORES/CLOCK CSV DATA *****
description,value
${coresClock.join('\n')}
***** START COMPATIBILITY CSV DATA *****
description,value
${compatibility.join('\n')}
***** END COMPATIBILITY CSV DATA *****
***** START PERFOMRANCE DETAILS TO INCLUDE *****
1. Performance rating is our estimate of how it performs compares to the best performing GPU in our database.
2. Value rating is based on the performance per dollar compared to other GPUs in the database.
***** END PERFOMRANCE DETAILS TO INCLUDE *****
***** START COMPATIBILITY DETAILS TO INCLUDE *****
1. Importance of having a large enough power supply.
2. Enough space to fit the GPU if it's a desktop or workstation market segment GPU.
***** END COMPATIBILITY DETAILS TO INCLUDE *****
***** START SUMMARY INSTRUCTIONS *****
1. Write an unbiased summary about the GPU using only the provided CSV data and details to include above.  Do not include other data.
2. Do not write a review.
3. Do not write bullet points or lists. Do not write headings. Only write paragraphs.
4. THe summary should be approximately 400 words long.
5. The summary target 4-5 paragraphs if possible.
6. There should be an intro, a performance paragraph, a memory paragraph, a cores/clock paragraph, a compability paragraph.
7. Each paragraph should be brief, only a few sentences based on the data above.
8. Include additional descriptors that apply. For example, "small", "large", "high-end", "low-end".
***** END SUMMARY INSTRUCTIONS *****
`.trim();
};

export function getGpuAiPrompt(gpu: GpuProduct) {
  return aiPromptTemplate(gpu);
}
