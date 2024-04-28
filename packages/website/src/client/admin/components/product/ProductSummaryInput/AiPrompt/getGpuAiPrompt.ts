import {
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
    cudaCores: productFieldFormattedValue(gpu?.fields?.cudaCores),
    executionUnits: productFieldFormattedValue(gpu?.fields?.executionUnits),
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
    shadingUnits: productFieldFormattedValue(gpu?.fields?.shadingUnits),
    slotWidth: productFieldFormattedValue(gpu?.fields?.slotWidth),
    streamMultiprocessors: productFieldFormattedValue(
      gpu?.fields?.streamMultiprocessors,
    ),
    streamProcessors: productFieldFormattedValue(gpu?.fields?.streamProcessors),
    suggestedPsu: productFieldFormattedValue(gpu?.fields?.suggestedPsu),
    tdp: productFieldFormattedValue(gpu?.fields?.tdp),
    tensorCores: productFieldFormattedValue(gpu?.fields?.tensorCores),
    tmus: productFieldFormattedValue(gpu?.fields?.tmus),
  };
};

const aiPromptTemplate = (gpu: GpuProduct) => {
  const summary = summaryData(gpu);

  const summaryPart1 = [
    `The GPU is ${summary.gpuName}.`,
    summary.marketSegment
      ? `It is designed for the ${summary.marketSegment} market.`
      : '',
    summary.company ? `It is a GPU made by ${summary.company}.` : '',
    summary.productionStatus
      ? `It has a production status of ${summary.productionStatus}.`
      : '',
    summary.msrp ? `It has a msrp of ${summary.msrp}.` : '',
    summary.releaseDate ? `Its release date is ${summary.releaseDate}.` : '',
    summary.architecture ? `Its architecture is ${summary.architecture}.` : '',
    summary.codename ? `Its codename is ${summary.codename}.` : '',
    summary.processSize
      ? `It was manufactured on a process size of ${summary.processSize}.`
      : '',
  ].filter((value) => value);

  const summaryPart2 = [
    summary.memorySize ? `The memory is ${summary.memorySize}.` : '',
    summary.memoryType ? `Its memory type is ${summary.memoryType}.` : '',
    summary.memoryClock ? `Its memory clock is ${summary.memoryClock}.` : '',
    summary.memoryClockEffective
      ? `Its effective memory clock is ${summary.memoryClockEffective}.`
      : '',
    summary.memoryInterface
      ? `Its memory interface is ${summary.memoryInterface}.`
      : '',
    summary.memoryBandwidth
      ? `Its memory bandwidth is ${summary.memoryBandwidth}.`
      : '',
  ].filter((value) => value);

  const summaryPart3 = [
    summary.cudaCores ? `The GPU has ${summary.cudaCores} CUDA Cores.` : '',
    summary.streamProcessors
      ? `The GPU has ${summary.streamProcessors} Stream Processors`
      : '',
    summary.shadingUnits ? `It has ${summary.shadingUnits} shading units.` : '',
    summary.computeUnits ? `It has ${summary.computeUnits} compute units.` : '',
    summary.executionUnits
      ? `It has ${summary.executionUnits} execution units.`
      : '',
    summary.streamMultiprocessors
      ? `It has ${summary.streamMultiprocessors} stream multiprocessors.`
      : '',
    summary.coreClock ? `It has a ${summary.coreClock} core clock.` : '',
    summary.coreBoostClock
      ? `It has a ${summary.coreBoostClock} boost core clock.`
      : '',
    summary.tmus ? `It has ${summary.tmus} TMUs.` : '',
    summary.rops ? `It has ${summary.rops} ROPs.` : '',
    summary.tensorCores ? `It has ${summary.tensorCores} tensor cores.` : '',
    summary.rtCores ? `It has ${summary.rtCores} RT cores.` : '',
  ].filter((value) => value);

  const summaryPart4 = [
    summary.suggestedPsu ? `Its suggested PSU is ${summary.suggestedPsu}.` : '',
    summary.tdp ? `It has a TDP of ${summary.tdp}.` : '',
    summary.slotWidth ? `It has a slot width of ${summary.slotWidth}.` : '',
  ].filter((value) => value);

  return `
You are a writer with an expertise in SEO and computer hardware.
Rewrite the following summary about a GPU using the following rules.

*** START RULES ***
The summary should be unbiased, impartial, and technical.
The summary should have a neutral tone. Avoid praising or criticizing the GPU or its manufacturer.
Include additional descriptors that apply. For example, "small", "large", "high-end", "low-end".
Do not write bullet points or lists. Do not write headings between paragraphs. Only write paragraphs.
Avoid including additional data from other sources.
The summary should be approximately 300 to 400 words long.
The summary target 4-5 paragraphs.
There should be an intro, a memory paragraph, a cores/clock paragraph, a compatibility paragraph. If you do not have enough data, then skip the paragraph.
The summary should be evergreen, as in it should not use words that could get outdated like current, active, or latest.
*** END RULES ***

*** START SUMMARY ***
${summaryPart1.join('\n')}

${summaryPart2.join('\n')}

${summaryPart3.join('\n')}

${summaryPart4.join('\n')}
*** END SUMMARY ***
`.trim();
};

export function getGpuAiPrompt(gpu: GpuProduct) {
  return aiPromptTemplate(gpu);
}
