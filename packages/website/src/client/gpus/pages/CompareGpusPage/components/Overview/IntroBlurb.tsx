import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

const IntroBlurbSentence1 = compileContentComponent(
  {
    deps: ['gpuName', 'marketSegment', 'releaseDate'],
    tags: [CompareGpusContentTag.SameCompany],
    component: (props) => (
      <>
        The {props.gpuName} is a {props.marketSegment} graphics card that
        released during {props.releaseDate}.
      </>
    ),
  },
  {
    deps: ['gpuName', 'marketSegment', 'releaseDate'],
    component: (props) => (
      <>
        The {props.gpuName} is a {props.marketSegment} graphics card will
        released during {props.releaseDate}.
      </>
    ),
  },
  {
    deps: ['company', 'shortGpuName', 'releaseDate'],
    tags: [CompareGpusContentTag.SameCompany],
    component: (props) => (
      <>
        The {props.shortGpuName} is a {props.company} graphics card that
        released during {props.releaseDate}.
      </>
    ),
  },
  {
    deps: ['company', 'shortGpuName', 'releaseDate'],
    component: (props) => (
      <>
        The {props.shortGpuName} is a {props.company} graphics card will release
        during {props.releaseDate}.
      </>
    ),
  },
);

const IntroBlurbSentence2 = compileContentComponent(
  {
    deps: ['launchPrice'],
    tags: [CompareGpusContentTag.SameCompany],
    component: (props) => (
      <>It launched with prices starting at {props.launchPrice} MSRP.</>
    ),
  },
  {
    deps: ['launchPrice'],
    component: (props) => (
      <>It is expected to have a MSRP of {props.launchPrice}.</>
    ),
  },
);

export const IntroBlurb = () => {
  const { comparison, contentData } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const context = useMemo(() => {
    const tags = {};
    const params = {};

    return { tags, params };
  }, []);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <IntroBlurbSentence1 /> <IntroBlurbSentence2 />
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
