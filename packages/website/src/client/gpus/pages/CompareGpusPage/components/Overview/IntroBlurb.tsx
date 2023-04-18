import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

const IntroBlurbSentence1 = compileContentComponent(
  {
    tags: [
      CompareGpusContentTag.SameCompany,
      CompareGpusContentTag.SameMarketSegment,
    ],
    deps: ['shortGpuName1', 'shortGpuName2', 'company1'],
    component: (props) => (
      <>
        The {props.shortGpuName1} and {props.shortGpuName2} are both{' '}
        {props.marketSegment1} graphics cards from {props.company1}.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameCompany],
    deps: ['shortGpuName1', 'shortGpuName2', 'company1'],
    component: (props) => (
      <>
        The {props.shortGpuName1} and {props.shortGpuName2} are both graphics
        cards from {props.company1}.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameMarketSegment],
    deps: ['gpuName1', 'gpuName2', 'marketSegment1'],
    component: (props) => (
      <>
        The {props.gpuName1} and {props.gpuName2} are both graphics cards that
        target the {props.marketSegment1} market.
      </>
    ),
  },
  {
    tags: [],
    deps: [
      'gpuName1',
      'gpuName2',
      'shortGpuName1',
      'shortGpuName2',
      'marketSegment1',
      'marketSegment2',
    ],
    component: (props) => (
      <>
        The {props.gpuName1} and {props.gpuName2} are graphics cards that target
        different markets, making them difficult to compare. The{' '}
        {props.shortGpuName1} targets {props.marketSegment1} users, whereas the{' '}
        {props.shortGpuName2} targets {props.marketSegment2} users.
      </>
    ),
  },
  {
    tags: [],
    deps: ['shortGpuName1', 'shortGpuName2', 'company1', 'company2'],
    component: (props) => (
      <>
        The {props.shortGpuName1} and {props.shortGpuName2} are graphics cards
        developed by {props.company1} and {props.company2}, respectively.
      </>
    ),
  },
);

const IntroBlurbSentence2 = compileContentComponent(
  {
    tags: [CompareGpusContentTag.SameReleaseDate],
    deps: ['releaseDate1'],
    component: (props) => (
      <>
        These two GPUs launched around the same time during {props.releaseDate1}
        .
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameReleaseYear],
    deps: [
      'newerShortGpuName',
      'newerReleaseDate',
      'olderShortGpuName',
      'olderReleaseDate',
    ],
    component: (props) => (
      <>
        The {props.newerShortGpuName} was released in {props.newerReleaseDate},
        making it slightly newer than the {props.olderShortGpuName}, which was
        released in {props.olderReleaseDate}.
      </>
    ),
  },
  {
    tags: [],
    deps: [
      'newerShortGpuName',
      'newerReleaseDate',
      'olderShortGpuName',
      'olderReleaseDate',
    ],
    component: (props) => (
      <>
        The {props.newerShortGpuName} was released in {props.newerReleaseDate},
        making it newer than the {props.olderShortGpuName}, which was released
        in {props.olderReleaseDate}.
      </>
    ),
  },
);

export const IntroBlurb = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p>
        <IntroBlurbSentence1 /> <IntroBlurbSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
