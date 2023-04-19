import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

const PerformanceAndValueBlurbSentence1 = compileContentComponent({
  tags: [],
  deps: ['fasterShortGpuName', 'slowerShortGpuName', 'fasterPerformanceFactor'],
  component: (props) => (
    <>
      The {props.fasterShortGpuName} is a more powerful card than the{' '}
      {props.slowerShortGpuName}, delivering approximately{' '}
      {props.fasterPerformanceFactor} better performance.
    </>
  ),
});

const PerformanceAndValueBlurbSentence2 = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentBetterPerformanceAndValue],
    deps: [
      'higherValueShortGpuName',
      'lowerValueShortGpuName',
      'betterValueFactor',
    ],
    component: (props) => (
      <>
        Despite being slower, the {props.higherValueShortGpuName} offers better
        value for money, with a {props.betterValueFactor} higher performance per
        dollar.
      </>
    ),
  },
  {
    tags: [],
    deps: [
      'higherValueShortGpuName',
      'lowerValueShortGpuName',
      'betterValueFactor',
    ],
    component: (props) => (
      <>
        The {props.higherValueShortGpuName} also has {props.betterValueFactor}{' '}
        better value with a higher performance per dollar than the{' '}
        {props.lowerValueShortGpuName}.
      </>
    ),
  },
);

export const PerformanceAndValueBlurb = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p>
        <PerformanceAndValueBlurbSentence1 />{' '}
        <PerformanceAndValueBlurbSentence2 />
      </p>
    </ContentContext.Provider>
  );
};

// The RTX 2060 and RTX 4070 are both powerful graphics cards from Nvidia, but they have a number of key differences.

// Architecture

// The RTX 2060 is based on the Turing architecture, while the RTX 4070 is based on the Ada Lovelace architecture. Ada Lovelace is a newer architecture, so it offers a number of performance improvements over Turing.

// CUDA cores

// The RTX 2060 has 1920 CUDA cores, while the RTX 4070 has 7,680 CUDA cores. This means that the RTX 4070 has more than four times as many CUDA cores as the RTX 2060. This increase in CUDA cores leads to a significant improvement in performance.

// Memory

// The RTX 2060 has 6GB of GDDR6 memory, while the RTX 4070 has 12GB of GDDR6X memory. This means that the RTX 4070 has twice as much memory as the RTX 2060. This extra memory can be useful for playing games at high resolutions or with high-quality textures.

// Boost clock

// The RTX 2060 has a boost clock of 1680 MHz, while the RTX 4070 has a boost clock of 2.6 GHz. This means that the RTX 4070 is significantly faster than the RTX 2060.

// TDP

// The RTX 2060 has a TDP of 160W, while the RTX 4070 has a TDP of 200W. This means that the RTX 4070 requires more power than the RTX 2060.

// Price

// The RTX 2060 was released at a starting price of $349, while the RTX 4070 is expected to have a starting price of $800. This means that the RTX 4070 is significantly more expensive than the RTX 2060.

// Overall

// The RTX 4070 is a significant upgrade over the RTX 2060. It offers better performance, more memory, a faster boost clock, and a higher TDP. However, it is also significantly more expensive than the RTX 2060.

// If you are looking for the best possible performance and you don't mind spending more money, then the RTX 4070 is the way to go. But if you are on a budget or you don't need the latest features, then the RTX 2060 is still a great option.
