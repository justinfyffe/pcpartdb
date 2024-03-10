import {
  formatGpuDimensions,
  formatProductName,
  GpuProduct,
  productFieldFormattedValue,
} from '@pcpartdb/shared';

const summaryData = (gpu: GpuProduct) => {
  return {
    architecture: productFieldFormattedValue(gpu?.fields?.architecture),
    codename: productFieldFormattedValue(gpu?.fields?.codename),
    company: gpu?.company,
    computeUnits: productFieldFormattedValue(gpu?.fields?.computeUnits),
    coreClock: productFieldFormattedValue(gpu?.fields?.gpuCoreBaseClock),
    coreBoostClock: productFieldFormattedValue(gpu?.fields?.gpuCoreBoostClock),
    cores: productFieldFormattedValue(gpu?.fields?.gpuCores),
    dimensions: formatGpuDimensions(gpu),
    gpuName: formatProductName(gpu),
    marketSegment: productFieldFormattedValue(gpu?.fields?.marketSegment),
    memoryBandwidth: productFieldFormattedValue(gpu?.fields?.memoryBandwidth),
    memoryClock: productFieldFormattedValue(gpu?.fields?.memoryClock),
    memoryClockEffective: productFieldFormattedValue(
      gpu?.fields?.memoryClockEffective,
    ),
    memoryInterface: productFieldFormattedValue(gpu?.fields?.memoryInterface),
    memorySize: productFieldFormattedValue(gpu?.fields?.memorySize),
    memoryType: productFieldFormattedValue(gpu?.fields?.memoryType),
    msrp: productFieldFormattedValue(gpu?.fields?.msrp),
    processSize: productFieldFormattedValue(gpu?.fields?.processSize),
    productionStatus: productFieldFormattedValue(gpu?.fields?.productionStatus),
    releaseDate: productFieldFormattedValue(gpu?.fields?.releaseDate),
    rops: productFieldFormattedValue(gpu?.fields?.rops),
    rtCores: productFieldFormattedValue(gpu?.fields?.rtCores),
    slotWidth: productFieldFormattedValue(gpu?.fields?.slotWidth),
    suggestedPsu: productFieldFormattedValue(gpu?.fields?.suggestedPsu),
    tdp: productFieldFormattedValue(gpu?.fields?.tdp),
    tensorCores: productFieldFormattedValue(gpu?.fields?.tensorCores),
    tmus: productFieldFormattedValue(gpu?.fields?.tmus),
  };
};

const aiPromptTemplate = (gpu: GpuProduct) => {
  const summary = summaryData(gpu);

  return `
You are a writer with an expertise in SEO and computer hardware.
Rewrite the following summary about a GPU using the following rules.

*** START RULES ***
The summary should be unbiased and technical.
Include additional descriptors that apply. For example, "small", "large", "high-end", "low-end".
Do not write bullet points or lists. Do not write headings between paragraphs. Only write paragraphs.
Avoid including additional data from other sources.
The summary should be approximately 300 to 400 words long.
The summary target 4-5 paragraphs.
There should be an intro, a memory paragraph, a cores/clock paragraph, a compability paragraph. If you do not have enough data, then skip the paragraph.
*** END RULES ***

*** START SUMMARY ***
The GPU is ${summary.gpuName}.
${
  gpu.parent
    ? `The GPU is based off of the ${formatProductName(gpu.parent)} chipset.`
    : ''
}
${
  summary.marketSegment
    ? `It is designed for the ${summary.marketSegment} market.`
    : ''
}
${summary.company ? `It is a GPU made by ${summary.company}.` : ''}
${
  summary.productionStatus
    ? `It has a production status of ${summary.productionStatus}.`
    : ''
}
${summary.msrp ? `It has a msrp of ${summary.msrp}.` : ''}
${summary.releaseDate ? `Its release date is ${summary.releaseDate}.` : ''}
${summary.architecture ? `Its architecture is ${summary.architecture}.` : ''}
${summary.codename ? `Its codename is ${summary.codename}.` : ''}
${
  summary.processSize
    ? `It was manufactured on a process size of ${summary.processSize}.`
    : ''
}

${summary.memorySize ? `The memory is ${summary.memorySize}.` : ''}
${summary.memoryType ? `Its memory type is ${summary.memoryType}.` : ''}
${summary.memoryClock ? `Its memory clock is ${summary.memoryClock}.` : ''}
${
  summary.memoryClockEffective
    ? `Its effective memory clock is ${summary.memoryClockEffective}.`
    : ''
}
${
  summary.memoryInterface
    ? `Its memory interface is ${summary.memoryInterface}.`
    : ''
}
${
  summary.memoryBandwidth
    ? `Its memory bandwidth is ${summary.memoryBandwidth}.`
    : ''
}

${summary.cores ? `The GPU has ${summary.cores} cores.` : ''}
${summary.computeUnits ? `It has ${summary.computeUnits} compute units.` : ''}
${summary.tmus ? `It has ${summary.tmus} TMUs.` : ''}
${summary.rops ? `It has ${summary.rops} ROPs.` : ''}
${summary.tensorCores ? `It has ${summary.tensorCores} tensor cores.` : ''}
${summary.rtCores ? `It has ${summary.rtCores} RT cores.` : ''}
${summary.coreClock ? `It has a ${summary.coreClock} core clock.` : ''}
${
  summary.coreBoostClock
    ? `It has a ${summary.coreBoostClock} boost core clock.`
    : ''
}

${summary.suggestedPsu ? `Its suggested PSU is ${summary.suggestedPsu}.` : ''}
${summary.tdp ? `It has a TDP of ${summary.tdp}.` : ''}
${summary.slotWidth ? `It has a slot width of ${summary.slotWidth}.` : ''}
${summary.dimensions ? `Its dimensions are ${summary.dimensions}.` : ''}

*** END SUMMARY ***
`.trim();
};

export function getGpuAiPrompt(gpu: GpuProduct) {
  return aiPromptTemplate(gpu);
}
