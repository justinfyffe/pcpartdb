'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import {
  ProductionStatusTag,
  SpecsTag,
} from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const IntroMarketSegment = compileContentComponent(
  {
    tags: [ProductionStatusTag.Unreleased, SpecsTag.Cores, SpecsTag.Threads],
    component: (props) => (
      <>
        The {props.name} is an unreleased {props.cores}-core ({props.threads}
        -thread) processor built for the {props.marketSegment} CPU market.
      </>
    ),
  },
  {
    tags: [ProductionStatusTag.Unreleased, SpecsTag.Cores],
    component: (props) => (
      <>
        The {props.name} is an unreleased {props.cores}-core processor built for
        the {props.marketSegment} CPU market.
      </>
    ),
  },
  {
    tags: [ProductionStatusTag.EndOfLife, SpecsTag.Cores, SpecsTag.Threads],
    component: (props) => (
      <>
        The {props.name} is an end-of-life {props.cores}-core ({props.threads}
        -thread) processor built for the {props.marketSegment} CPU market.
      </>
    ),
  },
  {
    tags: [ProductionStatusTag.EndOfLife, SpecsTag.Cores],
    component: (props) => (
      <>
        The {props.name} is an end-of-life {props.cores}-core processor built
        for the {props.marketSegment} CPU market.
      </>
    ),
  },
  {
    tags: [SpecsTag.Cores, SpecsTag.Threads],
    component: (props) => (
      <>
        The {props.name} is a {props.cores}-core ({props.threads}
        -thread) processor built for the {props.marketSegment} CPU market.
      </>
    ),
  },
  {
    tags: [SpecsTag.Cores],
    component: (props) => (
      <>
        The {props.name} is a {props.cores}-core processor built for the{' '}
        {props.marketSegment} CPU market.
      </>
    ),
  },
  {
    tags: [],
    component: (props) => (
      <>
        The {props.nameWithNoCompany} is an {props.company} processor built for
        the {props.marketSegment} CPU market.
      </>
    ),
  },
);

const IntroReleaseDateAndMsrp = compileContentComponent(
  {
    tags: [SpecsTag.Msrp, SpecsTag.ReleaseDate],
    component: (props) => {
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
    component: (props) => {
      return <>It has a suggested retail price of {props.msrp}.</>;
    },
  },
  {
    tags: [SpecsTag.ReleaseDate],
    component: (props) => {
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

const IntroArchitecture = compileContentComponent(
  {
    tags: [SpecsTag.Architecture, SpecsTag.Generation],
    component: (props) => (
      <>
        It is part of {props.company}&apos;s {props.generation} lineup, which is
        based on the {props.architecture} microarchitecture.
      </>
    ),
  },
  {
    tags: [SpecsTag.Architecture],
    component: (props) => (
      <>It is based on the {props.architecture} microarchitecture.</>
    ),
  },
  {
    tags: [SpecsTag.Generation],
    component: (props) => (
      <>
        It is part of {props.company}&apos;s {props.generation} lineup.
      </>
    ),
  },
);

const IntroSocketAndFabrication = compileContentComponent(
  {
    tags: [SpecsTag.Socket, SpecsTag.Foundry, SpecsTag.ProcessSize],
    component: (props) => (
      <>
        The {props.nameWithNoCompany} is compatible with {props.socket}{' '}
        motherboards and is fabricated on {props.foundry}&apos;s{' '}
        {props.processSize} manufacturing process.
      </>
    ),
  },
  {
    tags: [SpecsTag.Socket, SpecsTag.ProcessSize],
    component: (props) => (
      <>
        The {props.nameWithNoCompany} is compatible with {props.socket}{' '}
        motherboards and is fabricated on a {props.processSize} manufacturing
        process.
      </>
    ),
  },
  {
    tags: [SpecsTag.Foundry, SpecsTag.ProcessSize],
    component: (props) => (
      <>
        The {props.nameWithNoCompany} is fabricated on {props.foundry}&apos;s{' '}
        {props.processSize} manufacturing process.
      </>
    ),
  },
  {
    tags: [SpecsTag.Socket],
    component: (props) => (
      <>
        The {props.nameWithNoCompany} is compatible with {props.socket}{' '}
        motherboards.
      </>
    ),
  },
  {
    tags: [SpecsTag.ProcessSize],
    component: (props) => (
      <>
        The {props.nameWithNoCompany} is fabricated on a {props.processSize}{' '}
        manufacturing process.
      </>
    ),
  },
);

const IntroFeatures = compileContentComponent(
  {
    tags: [SpecsTag.IntegratedGraphics, SpecsTag.BundledCooler],
    component: (props) => (
      <>
        It features the {props.integratedGraphics} integrated graphics solution
        and is bundled with a {props.bundledCooler} cooler.
      </>
    ),
  },
  {
    tags: [SpecsTag.IntegratedGraphics],
    component: (props) => (
      <>
        It features the {props.integratedGraphics} integrated graphics solution.
      </>
    ),
  },
  {
    tags: [SpecsTag.BundledCooler],
    component: (props) => <>It is bundled a {props.bundledCooler} cooler.</>,
  },
);

const IntroParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <IntroMarketSegment /> <IntroReleaseDateAndMsrp /> <IntroArchitecture />{' '}
      <IntroSocketAndFabrication /> <IntroFeatures />
    </p>
  ),
});

interface IntroBlurbProps {}

export const IntroBlurb: FunctionComponent<IntroBlurbProps> = (_props) => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <IntroParagraph />
    </ContentProvider>
  );
};
