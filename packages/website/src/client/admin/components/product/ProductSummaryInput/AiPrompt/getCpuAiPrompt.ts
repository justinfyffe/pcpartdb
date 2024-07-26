import {
  CpuProduct,
  formatProductName,
  productFieldFormattedValue,
} from '@pcpartdb/shared';

const summaryData = (cpu: CpuProduct) => {
  return {
    architecture: productFieldFormattedValue(cpu?.fields?.architecture),
    bundledCooler: productFieldFormattedValue(cpu?.fields?.bundledCooler),
    clock: productFieldFormattedValue(cpu?.fields?.clock),
    company: cpu?.company,
    cores: productFieldFormattedValue(cpu?.fields?.cores),
    cpuName: formatProductName(cpu),
    eCores: productFieldFormattedValue(cpu?.fields?.eCores),
    generation: productFieldFormattedValue(cpu?.fields?.generation),
    integratedGraphics: productFieldFormattedValue(
      cpu?.fields?.integratedGraphics,
    ),
    l1Cache: productFieldFormattedValue(cpu?.fields?.l1Cache),
    l2Cache: productFieldFormattedValue(cpu?.fields?.l2Cache),
    l3Cache: productFieldFormattedValue(cpu?.fields?.l3Cache),
    marketSegment: productFieldFormattedValue(cpu?.fields?.marketSegment),
    memoryChannels: productFieldFormattedValue(cpu?.fields?.memoryChannels),
    memorySupport: productFieldFormattedValue(cpu?.fields?.memorySupport),
    msrp: productFieldFormattedValue(cpu?.fields?.msrp),
    multiplierUnlocked: productFieldFormattedValue(
      cpu?.fields?.multiplierUnlocked,
    ),
    pciExpress: productFieldFormattedValue(cpu?.fields?.pciExpress),
    pCores: productFieldFormattedValue(cpu?.fields?.pCores),
    processSize: productFieldFormattedValue(cpu?.fields?.processSize),
    productionStatus: productFieldFormattedValue(cpu?.fields?.productionStatus),
    releaseDate: productFieldFormattedValue(cpu?.fields?.releaseDate),
    socket: productFieldFormattedValue(cpu?.fields?.socket),
    tdp: productFieldFormattedValue(cpu?.fields?.tdp),
    threads: productFieldFormattedValue(cpu?.fields?.threads),
    turboClock: productFieldFormattedValue(cpu?.fields?.turboClock),
  };
};

const aiPromptTemplate = (cpu: CpuProduct) => {
  const summary = summaryData(cpu);

  const summaryPart1 = [
    `The CPU is ${summary.cpuName}.`,
    summary.marketSegment
      ? `It is designed for the ${summary.marketSegment} market.`
      : '',
    summary.company ? `It is a CPU made by ${summary.company}.` : '',
    summary.productionStatus
      ? `It has a production status of ${summary.productionStatus}.`
      : '',
    summary.msrp ? `It has a msrp of ${summary.msrp}.` : '',
    summary.releaseDate ? `Its release date is ${summary.releaseDate}.` : '',
    summary.architecture ? `Its architecture is ${summary.architecture}.` : '',
    summary.generation ? `Its generation is ${summary.generation}.` : '',
    summary.processSize
      ? `It was manufactured on a process size of ${summary.processSize}.`
      : '',
    summary.socket ? `Its socket is the ${summary.socket}.` : '',
  ].filter((value) => value);

  const summaryPart2 = [
    summary.cores ? `The CPU has ${summary.cores} total cores.` : '',
    summary.pCores ? `It has ${summary.pCores} performance cores.` : '',
    summary.eCores ? `It has ${summary.eCores} efficient cores.` : '',
    summary.threads ? `It has ${summary.threads} threads.` : '',
    summary.clock ? `It has a clock speed of ${summary.clock}.` : '',
    summary.turboClock
      ? `It has a turbo clock speed of ${summary.turboClock}.`
      : '',
    cpu?.fields?.multiplierUnlocked?.value === true
      ? 'Its multiplier is unlocked, making the CPU overclockable.'
      : '',
    cpu?.fields?.multiplierUnlocked?.value === false
      ? 'Its multiplier is locked, making the CPU not overclockable.'
      : '',
    summary.l1Cache ? `It has a L1 cache of ${summary.l1Cache}.` : '',
    summary.l2Cache ? `It has a L2 cache of ${summary.l2Cache}.` : '',
    summary.l3Cache ? `It has a L3 cache of ${summary.l3Cache}.` : '',
    summary.memorySupport
      ? `Its memory support is ${summary.memorySupport}.`
      : '',
    summary.memoryChannels
      ? `Its memory channel is ${summary.memoryChannels}.`
      : '',
    summary.pciExpress ? `Its PCI Express is ${summary.pciExpress}.` : '',
    summary.tdp ? `Its TDP is ${summary.tdp}.` : '',
  ].filter((value) => value);

  const summaryPart3 = [
    summary.integratedGraphics
      ? `Its integrated graphics solution is the ${summary.integratedGraphics}.`
      : '',
    summary.bundledCooler
      ? `Its bundled with the ${summary.bundledCooler} cooler.`
      : '',
  ].filter((value) => value);

  return `
You are a writer with an expertise in SEO and computer hardware.
Rewrite the following summary about a CPU using the following rules.

*** START RULES ***
The summary should be unbiased, impartial, and technical.
The summary should have a neutral tone. Avoid praising or criticizing the CPU or its manufacturer.
Include additional descriptors that apply. For example, "small", "large", "high-end", "low-end".
Do not write bullet points or lists. Only write paragraphs.
Headings are okay. Example headings are "Cores", "Compatibility", "Memory".
Paragraphs shouldn't be too long. At most, 3-4 sentences per paragraph. Two sentence paragraphs are okay.
Try to have two or more paragraphs per heading. One is okay if there is not enough information.
Avoid including additional data from other sources.
The summary should be approximately 350-500 words long..
There should at least be an intro, a memory paragraph, a cores/clock paragraph, a compatibility paragraph, a cache paragraph. If you do not have enough data, then skip the paragraph.
The summary should be evergreen, as in it should not use words that could get outdated like current, active, or latest.
The summary should reference the release date if there is one.
*** END RULES ***

*** START SUMMARY ***
${summaryPart1.join('\n')}

${summaryPart2.join('\n')}

${summaryPart3.join('\n')}
*** END SUMMARY ***
`.trim();
};

export function getCpuAiPrompt(cpu: CpuProduct) {
  return aiPromptTemplate(cpu);
}
