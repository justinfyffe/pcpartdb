import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

const IntroAudience = compileContentComponent(
  {
    tags: [
      CompareGpusContentTag.DifferentCompany,
      CompareGpusContentTag.DifferentMarketSegment,
    ],
    deps: ['marketSegment1', 'marketSegment2'],
    // The NVIDIA GeForce RTX 3070 and the AMD Radeon RX 7900 XTX are graphics cards with
    // different use cases, making it difficult to compare them directly. The RTX 3070 is
    // designed for the desktop GPU market, while the RX 7900 XTX targets the workstation market.
    component: (props) => (
      <>
        The {props.gpuName1} and the {props.gpuName2} are graphics cards with
        different use cases, making it difficult to compare them directly. The{' '}
        {props.shortestGpuName1} is designed for the {props.marketSegment1} GPU{' '}
        market, while the {props.shortestGpuName2} targets the{' '}
        {props.marketSegment2} market.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.DifferentCompany,
      CompareGpusContentTag.SameMarketSegment,
    ],
    deps: ['marketSegment1'],
    // The NVIDIA GeForce RTX 3070 and the AMD Radeon RX 7900 XTX are both graphics cards
    // that target the desktop GPU market.
    component: (props) => (
      <>
        The {props.gpuName1} and the {props.gpuName2} are both graphics cards
        that target the {props.marketSegment1} GPU market.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.SameCompany,
      CompareGpusContentTag.DifferentMarketSegment,
    ],
    deps: ['company1', 'marketSegment1', 'marketSegment2'],
    // The GeForce RTX 3070 and the Radeon RX 7900 XTX are NVIDIA graphics cards with
    // different use cases, making it difficult to compare them directly. The RTX 3070 is
    // designed for the desktop GPU market, while the RX 7900 XTX targets the workstation market.
    component: (props) => (
      <>
        The {props.shortGpuName1} and the {props.shortGpuName2} are{' '}
        {props.company1} graphics cards with different use cases, making it
        difficult to compare them directly. The {props.shortestGpuName1} is
        designed for the {props.marketSegment1} GPU market, while the{' '}
        {props.shortestGpuName2} targets the {props.marketSegment2} market.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.SameCompany,
      CompareGpusContentTag.SameMarketSegment,
    ],
    deps: ['company1', 'marketSegment1'],
    // The GeForce RTX 3070 and the Radeon RX 7900 XTX are NVIDIA graphics cards that target
    // the workstation GPU market.
    component: (props) => (
      <>
        The {props.shortGpuName1} and the {props.shortGpuName2} are{' '}
        {props.company1} graphics cards that target the {props.marketSegment1}{' '}
        GPU market.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.DifferentCompany],
    deps: ['company1', 'company2'],
    // NVIDIA designed the GeForce RTX 3070, and AMD designed the Radeon RX 7900 XTX.
    component: (props) => (
      <>
        {props.company1} designed the {props.shortGpuName1}, and{' '}
        {props.company2} designed the {props.shortGpuName2}.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameCompany],
    deps: ['company1'],
    // The GeForce RTX 3070 and Radeon RX 7900 XTX are both developed by NVIDIA.
    component: (props) => (
      <>
        The {props.shortGpuName1} and {props.shortestGpuName2} are both
        developed by {props.company1}.
      </>
    ),
  },
);

const IntroReleaseDate = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentReleaseDate],
    deps: ['releaseDate1', 'releaseDate2', 'gpu2WillReleaseOrWasReleased'],
    // The RTX 3070 is the newer card of the two GPUs, having a release date of Q2 2022,
    // while the RX 7900 was released in Q1 2022.
    component: (props) => (
      <>
        The {props.shortestGpuName1} is the {props.gpu1NewerOrOlder} card of the
        two GPUs, having a release date of {props.releaseDate1}, while the{' '}
        {props.shortestGpuName2} {props.gpu2WillReleaseOrWasReleased} in{' '}
        {props.releaseDate2}.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameReleaseDate],
    deps: ['releaseDate1'],
    // These graphics cards were released during Q3 2022.
    component: (props) => (
      <>
        These graphics cards {props.gpu1WillReleaseOrWereReleased} in{' '}
        {props.releaseDate1}.
      </>
    ),
  },
);

const IntroLaunchPrice = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentLaunchPrice],
    deps: ['gpu1LaunchPriceHigherOrLower', 'launchPrice1', 'launchPrice2'],
    // The RTX 3070 has a higher launch price, at $999 compared to the RX 7900 XTX's $399.
    component: (props) => (
      <>
        The {props.shortestGpuName1} has a {props.gpu1LaunchPriceHigherOrLower}{' '}
        launch price, at {props.launchPrice1} compared to the{' '}
        {props.shortestGpuName2}&apos;s {props.launchPrice2}.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameLaunchPrice],
    deps: ['launchPrice1'],
    // The RTX 3070 has the same launch price as the RX 7900 XTX, $399.
    component: (props) => (
      <>
        The {props.shortestGpuName1} has the same launch price as the{' '}
        {props.shortestGpuName2}&apos; {props.launchPrice1}.
      </>
    ),
  },
);

const IntroParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <IntroAudience /> <IntroReleaseDate /> <IntroLaunchPrice />
    </p>
  ),
});

export const IntroBlurb = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <IntroParagraph />
    </ContentContext.Provider>
  );
};
