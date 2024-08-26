'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import {
  ProductionStatusTag,
  SpecsTag,
} from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const IntroSentence1 = compileContentComponent(
  {
    // Unreleased CPU with cores and threads
    tags: [ProductionStatusTag.Unreleased, SpecsTag.Cores, SpecsTag.Threads],
    Component: (props) => (
      <>
        The {props.name} is an unreleased {props.cores}-core ({props.threads}
        -thread) processor built for the {props.marketSegment} CPU market.
      </>
    ),
  },
  {
    // Unreleased CPU with cores
    tags: [ProductionStatusTag.Unreleased, SpecsTag.Cores],
    Component: (props) => (
      <>
        The {props.name} is an unreleased {props.cores}-core processor built for
        the {props.marketSegment} CPU market.
      </>
    ),
  },
  {
    // End-of-life CPU with cores and threads
    tags: [ProductionStatusTag.EndOfLife, SpecsTag.Cores, SpecsTag.Threads],
    Component: (props) => (
      <>
        The {props.name} is an end-of-life {props.cores}-core ({props.threads}
        -thread) processor built for the {props.marketSegment} CPU market.
      </>
    ),
  },
  {
    // End-of-life CPU with cores
    tags: [ProductionStatusTag.EndOfLife, SpecsTag.Cores],
    Component: (props) => (
      <>
        The {props.name} is an end-of-life {props.cores}-core processor built
        for the {props.marketSegment} CPU market.
      </>
    ),
  },
  {
    // CPU with cores and threads
    tags: [SpecsTag.Cores, SpecsTag.Threads],
    Component: (props) => (
      <>
        The {props.name} is a {props.cores}-core ({props.threads}
        -thread) processor built for the {props.marketSegment} CPU market.
      </>
    ),
  },
  {
    // CPU with cores
    tags: [SpecsTag.Cores],
    Component: (props) => (
      <>
        The {props.name} is a {props.cores}-core processor built for the{' '}
        {props.marketSegment} CPU market.
      </>
    ),
  },
  {
    tags: [],
    Component: (props) => (
      <>
        The {props.nameWithNoCompany} is an {props.company} processor built for
        the {props.marketSegment} CPU market.
      </>
    ),
  },
);

const IntroSentence2 = compileContentComponent(
  {
    tags: [SpecsTag.Msrp, SpecsTag.ReleaseDate],
    Component: (props) => {
      let launches = 'is expected to launch';
      if (props.hasLaunched) {
        launches = 'launched';
      } else if (props.isPastReleaseDate) {
        launches = 'was planned to launch';
      }

      return (
        <>
          It {launches} in {props.releaseDate} with a suggested retail price of{' '}
          {props.msrp}.
        </>
      );
    },
  },
  {
    tags: [SpecsTag.Msrp],
    Component: (props) => {
      return <>It has a suggested retail price of {props.msrp}.</>;
    },
  },
  {
    tags: [SpecsTag.ReleaseDate],
    Component: (props) => {
      let launches = 'is expected to launch';
      if (props.hasLaunched) {
        launches = 'launched';
      } else if (props.isPastReleaseDate) {
        launches = 'was planned to launch';
      }

      return (
        <>
          It {launches} in {props.releaseDate}.
        </>
      );
    },
  },
);

const IntroSentence3 = compileContentComponent(
  {
    tags: [SpecsTag.Architecture, SpecsTag.Generation],
    Component: (props) => (
      <>
        It is part of {props.company}&apos;s {props.generation} lineup, which is
        based on the {props.architecture} microarchitecture.
      </>
    ),
  },
  {
    tags: [SpecsTag.Architecture],
    Component: (props) => (
      <>It is based on the {props.architecture} microarchitecture.</>
    ),
  },
  {
    tags: [SpecsTag.Generation],
    Component: (props) => (
      <>
        It is part of {props.company}&apos;s {props.generation} lineup.
      </>
    ),
  },
);

const IntroSentence4 = compileContentComponent(
  {
    tags: [SpecsTag.Socket, SpecsTag.Foundry, SpecsTag.ProcessSize],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoBrandNoTags} is compatible with{' '}
        {props.socket} motherboards and is fabricated on {props.foundry}&apos;s{' '}
        {props.processSize} manufacturing process.
      </>
    ),
  },
  {
    tags: [SpecsTag.Socket, SpecsTag.ProcessSize],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoBrandNoTags} is compatible with{' '}
        {props.socket} motherboards and is fabricated on a {props.processSize}{' '}
        manufacturing process.
      </>
    ),
  },
  {
    tags: [SpecsTag.Foundry, SpecsTag.ProcessSize],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} is fabricated on {props.foundry}
        &apos;s {props.processSize} manufacturing process.
      </>
    ),
  },
  {
    tags: [SpecsTag.Socket],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} is compatible with {props.socket}{' '}
        motherboards.
      </>
    ),
  },
  {
    tags: [SpecsTag.ProcessSize],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} is fabricated on a{' '}
        {props.processSize} manufacturing process.
      </>
    ),
  },
);

const IntroSentence5 = compileContentComponent(
  {
    tags: [SpecsTag.IntegratedGraphics, SpecsTag.BundledCooler],
    Component: (props) => (
      <>
        It features the {props.integratedGraphics} integrated graphics solution
        and is bundled with a {props.bundledCooler} cooler.
      </>
    ),
  },
  {
    tags: [SpecsTag.IntegratedGraphics],
    Component: (props) => (
      <>
        It features the {props.integratedGraphics} integrated graphics solution.
      </>
    ),
  },
  {
    tags: [SpecsTag.BundledCooler],
    Component: (props) => <>It is bundled a {props.bundledCooler} cooler.</>,
  },
);

const IntroParagraph = compileContentComponent({
  tags: [],
  deps: [],
  Component: () => (
    <>
      <p>
        <IntroSentence1 /> <IntroSentence2 /> <IntroSentence3 />{' '}
        <IntroSentence4 /> <IntroSentence5 />
      </p>
    </>
  ),
});

interface IntroBlurbProps {
  index?: number;
}

export const IntroBlurb: FunctionComponent<IntroBlurbProps> = (props) => {
  const { contentTags, contentParams } = useProductContent(props.index);

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <IntroParagraph />
    </ContentProvider>
  );
};
