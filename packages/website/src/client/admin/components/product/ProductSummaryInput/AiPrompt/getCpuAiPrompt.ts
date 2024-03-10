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

  return `
You are a writer with an expertise in SEO and computer hardware.
Rewrite the following summary about a CPU using the following rules.

*** START RULES ***
The summary should be unbiased and technical.
Include additional descriptors that apply. For example, "small", "large", "high-end", "low-end".
Do not write bullet points or lists. Do not write headings between paragraphs. Only write paragraphs.
Avoid including additional data from other sources.
The summary should be approximately 300 to 400 words long.
The summary target 4-5 paragraphs.
There should be an intro, and 2-3 paragraphs about its specs . If you do not have enough data, then skip the paragraph.
*** END RULES ***

*** START SUMMARY ***
The CPU is ${summary.cpuName}.
${
  summary.marketSegment
    ? `It is designed for the ${summary.marketSegment} market.`
    : ''
}
${summary.company ? `It is a CPU made by ${summary.company}.` : ''}
${
  summary.productionStatus
    ? `It has a production status of ${summary.productionStatus}.`
    : ''
}
${summary.msrp ? `It has a msrp of ${summary.msrp}.` : ''}
${summary.releaseDate ? `Its release date is ${summary.releaseDate}.` : ''}
${summary.architecture ? `Its architecture is ${summary.architecture}.` : ''}
${summary.generation ? `Its generation is ${summary.generation}.` : ''}
${
  summary.processSize
    ? `It was manufactured on a process size of ${summary.processSize}.`
    : ''
}
${summary.socket ? `Its socket is the ${summary.socket}.` : ''}

${summary.cores ? `The CPU has ${summary.cores} total cores.` : ''}
${summary.pCores ? `It has ${summary.pCores} performance cores.` : ''}
${summary.eCores ? `It has ${summary.eCores} efficient cores.` : ''}
${summary.threads ? `It has ${summary.threads} threads.` : ''}
${summary.clock ? `It has a clock speed of ${summary.clock}.` : ''}
${
  summary.turboClock
    ? `It has a turbo clock speed of ${summary.turboClock}.`
    : ''
}
${cpu?.fields?.multiplierUnlocked?.value ? 'Its multiplier is unlocked.' : ''}
${
  cpu?.fields?.multiplierUnlocked?.value === false
    ? 'Its multiplier is locked.'
    : ''
}
${summary.l1Cache ? `It has a L1 cache of ${summary.l1Cache}.` : ''}
${summary.l2Cache ? `It has a L2 cache of ${summary.l2Cache}.` : ''}
${summary.l3Cache ? `It has a L3 cache of ${summary.l3Cache}.` : ''}
${
  summary.memorySupport ? `Its memory support is ${summary.memorySupport}.` : ''
}
${
  summary.memoryChannels
    ? `Its memory channel is ${summary.memoryChannels}.`
    : ''
}
${summary.pciExpress ? `Its PCI Express is ${summary.pciExpress}.` : ''}
${summary.tdp ? `Its TDP is ${summary.tdp}.` : ''}

${
  summary.integratedGraphics
    ? `Its integrated graphics solution is the ${summary.integratedGraphics}.`
    : ''
}
${
  summary.bundledCooler
    ? `Its bundled with the ${summary.bundledCooler} cooler.`
    : ''
}

*** END SUMMARY ***
`.trim();
};

export function getCpuAiPrompt(cpu: CpuProduct) {
  return aiPromptTemplate(cpu);
}
