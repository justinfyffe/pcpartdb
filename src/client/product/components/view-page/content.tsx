import { compileContent } from '@client/shared/content';
import React from 'react';

export enum ContentHint {
  BestPerformance = 'BEST_PERFORMANCE',
  BestValue = 'BEST_VALUE',
  Recent = 'RECENT',
  Released = 'RELEASED',
}

export const IntroSentence1 = compileContent(
  {
    hints: [ContentHint.Recent, ContentHint.Released],
    deps: ['productName', 'marketSegment', 'company', 'releaseDate'],
    component: (props) => (
      <>
        The {props.productName} is a {props.marketSegment} {props.company} GPU
        that recently launched during {props.releaseDate}.
      </>
    ),
  },
  {
    hints: [ContentHint.Recent, ContentHint.Released],
    deps: ['productName', 'company', 'releaseDate'],
    component: (props) => (
      <>
        The {props.productName} is a {props.company} GPU that recently launched
        during {props.releaseDate}.
      </>
    ),
  },
  {
    hints: [ContentHint.Released],
    deps: ['productName', 'marketSegment', 'company', 'releaseDate'],
    component: (props) => (
      <>
        The {props.productName} is a {props.marketSegment} {props.company} GPU
        that launched during {props.releaseDate}.
      </>
    ),
  },
  {
    deps: ['productName', 'marketSegment', 'company', 'releaseDate'],
    component: (props) => (
      <>
        The {props.productName} is a {props.marketSegment} {props.company} GPU
        with a release date of {props.releaseDate}.
      </>
    ),
  },
  {
    deps: ['productName', 'company', 'releaseDate'],
    component: (props) => (
      <>
        The {props.productName} by {props.company} has a release date of{' '}
        {props.releaseDate}.
      </>
    ),
  },
  {
    deps: ['productName', 'company'],
    component: (props) => (
      <>
        The {props.productName} is a GPU by {props.company}.
      </>
    ),
  },
);

export const IntroSentence2 = compileContent({
  deps: ['budgetSegment', 'msrp'],
  component: (props) => (
    <>
      It is targeted towards the {props.budgetSegment} PC market with a MSRP of{' '}
      {props.msrp}.
    </>
  ),
});

export const PerformanceSentence1 = compileContent(
  {
    hints: [ContentHint.BestPerformance],
    deps: ['productName'],
    component: (props) => (
      <>The {props.productName} is the best performing GPU in our database.</>
    ),
  },
  {
    deps: ['productName', 'rank'],
    component: (props) => (
      <>
        The {props.productName} is the {props.rank} most performant GPU in our
        database.
      </>
    ),
  },
);

export const PerformanceSentence2 = compileContent(
  {
    hints: [ContentHint.BestPerformance],
    deps: ['percentage', 'otherProductName'],
    component: (props) => (
      <>
        It is approximately {props.percentage} better performing than the next
        best GPU, the {props.otherProductName}.
      </>
    ),
  },
  {
    deps: ['productName', 'rank'],
    component: (props) => (
      <>
        The {props.productName} is the {props.rank} most performant GPU in our
        database.
      </>
    ),
  },
);

export const PerformanceSentence3 = compileContent(
  {
    hints: [ContentHint.BestValue],
    deps: [],
    component: (_props) => (
      <>It also has the best value compared to the other GPUs.</>
    ),
  },
  {
    deps: ['percentage', 'otherProductName'],
    component: (props) => (
      <>
        It is also {props.percentage} stronger than the GPU with the best value,
        the {props.otherProductName}.
      </>
    ),
  },
);

export const PerformanceSentence4 = compileContent(
  {
    hints: [ContentHint.BestPerformance],
    deps: ['totalProducts', 'releaseYear'],
    component: (props) => (
      <>
        This graphics card is the strongest card among the {props.totalProducts}{' '}
        GPUs that also launched in {props.releaseYear}.
      </>
    ),
  },
  {
    deps: ['releaseDateRank', 'totalProducts', 'releaseYear'],
    component: (props) => (
      <>
        This graphics card is the {props.releaseDateRank} strongest card among
        the {props.totalProducts} GPUs that also launched in {props.releaseYear}
        .
      </>
    ),
  },
);

export const PerformanceSentence5 = compileContent({
  deps: ['companyRank', 'company', 'architectureRank', 'architecture'],
  component: (props) => (
    <>
      Additionally, it is the {props.companyRank} most powerful {props.company}{' '}
      GPU, and {props.architectureRank}
      in the {props.architecture} architecture family.
    </>
  ),
});
