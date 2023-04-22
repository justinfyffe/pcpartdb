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
    // designed for desktop users, while the RX 7900 XTX is designed for workstation use.
    component: (props) => (
      <>
        The {props.gpuName1} and the {props.gpuName2} are graphics cards with
        different use cases, making it difficult to compare them directly. The{' '}
        {props.shortestGpuName1} is designed for {props.marketSegment1} users,
        while the {props.shortestGpuName2} is designed for{' '}
        {props.marketSegment2} use.
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
    // that target desktop users.
    component: (props) => (
      <>
        The {props.gpuName1} and the {props.gpuName2} are both graphics cards
        that target {props.marketSegment1} users.
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
    // designed for desktop users, while the RX 7900 XTX is designed for workstation use.
    component: (props) => (
      <>
        The {props.shortGpuName1} and the {props.shortGpuName2} are{' '}
        {props.company1} graphics cards with different use cases, making it
        difficult to compare them directly. The {props.shortestGpuName1} is
        designed for {props.marketSegment1} users, while the{' '}
        {props.shortestGpuName2} is designed for {props.marketSegment2} use.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.SameCompany,
      CompareGpusContentTag.SameMarketSegment,
    ],
    deps: ['company1', 'marketSegment1'],
    // The GeForce RTX 3070 and the Radeon RX 7900 XTX are NVIDIA graphics cards with
    // different use cases, making it difficult to compare them directly. The RTX 3070 is
    // designed for desktop users, while the RX 7900 XTX is designed for workstation use.
    component: (props) => (
      <>
        The {props.shortGpuName1} and the {props.shortGpuName2} are{' '}
        {props.company1} graphics cards that target {props.marketSegment1}{' '}
        users.
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
    tags: [
      CompareGpusContentTag.DifferentReleaseDate,
      CompareGpusContentTag.DifferentReleaseYear,
    ],
    deps: ['releaseDate1', 'releaseDate2'],
    // The RTX 3070 is a newer card than the RX 7900 XTX. It was released in Q2 2022,
    // while the RX 7900 XTX was released in Q1 2022.
    component: (props) => (
      <>
        The {props.shortestGpuName1} is a {props.gpu1NewerOrOlder} than the{' '}
        {props.shortestGpuName2}. It {props.gpu1WillReleaseOrWasReleased} in{' '}
        {props.releaseDate1}, while the {props.shortestGpuName2}{' '}
        {props.gpu2WillReleaseOrWasReleased} in {props.releaseDate2}.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.DifferentReleaseDate,
      CompareGpusContentTag.SameReleaseYear,
    ],
    deps: ['releaseDate1', 'releaseDate2'],
    // The RTX 3070 is a slightly newer card than the RX 7900 XTX. It was released in Q2 2022,
    // while the RX 7900 XTX was released in Q1 2022.
    component: (props) => (
      <>
        The {props.shortestGpuName1} is a slightly {props.gpu1NewerOrOlder} than
        the {props.shortestGpuName2}. It {props.gpu1WillReleaseOrWasReleased} in{' '}
        {props.releaseDate1}, while the {props.shortestGpuName2}{' '}
        {props.gpu2WillReleaseOrWasReleased} in {props.releaseDate2}.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameReleaseDate],
    deps: ['releaseDate1'],
    // Both graphics cards were released during Q3 2022.
    component: (props) => (
      <>
        Both graphics cards {props.gpu1WillReleaseOrWereReleased} during{' '}
        {props.releaseDate1}.
      </>
    ),
  },
);

const IntroParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <IntroAudience /> <IntroReleaseDate />
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
