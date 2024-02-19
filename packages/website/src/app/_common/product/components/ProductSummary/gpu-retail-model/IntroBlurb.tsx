'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import {
  MarketSegmentTag,
  ProductionStatusTag,
  SpecsTag,
} from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const IntroAudience = compileContentComponent(
  {
    tags: [ProductionStatusTag.Unreleased],
    component: (props) => {
      return (
        <>
          The {props.name} is an unreleased {props.marketSegment} graphics card
          based on the {props.chipsetName} chipset.
        </>
      );
    },
  },
  {
    tags: [ProductionStatusTag.EndOfLife],
    component: (props) => {
      return (
        <>
          The {props.name} is an end-of-life {props.marketSegment} graphics card
          based on the {props.chipsetName} chipset.
        </>
      );
    },
  },
  {
    tags: [MarketSegmentTag.Integrated],
    component: (props) => {
      return (
        <>
          The {props.name} is an integrated graphics card based on the{' '}
          {props.chipsetName} chipset.
        </>
      );
    },
  },
  {
    tags: [],
    component: (props) => {
      return (
        <>
          The {props.name} is a {props.marketSegment} graphics card based on the{' '}
          {props.chipsetName} chipset.
        </>
      );
    },
  },
);

const IntroReleaseDateAndMsrp = compileContentComponent(
  {
    // Example: It is expected to launch in Q4 2099 with a price of $999 (MSRP).
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
    // Example: It has a launch price of $999 (MSRP).
    tags: [SpecsTag.Msrp],
    component: (props) => {
      return <>It has a suggested retail price of {props.msrp}.</>;
    },
  },
  {
    // Example: It was planned to launch in Q2 1999.
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
    // Example: The AD199 chip that powers the GPU uses the Ada Lovelace architecture,
    //          and is built on the 5 nm process.
    tags: [SpecsTag.Architecture, SpecsTag.Codename, SpecsTag.ProcessSize],
    component: (props) => {
      return (
        <>
          The {props.codename} chip that powers the GPU uses the{' '}
          {props.architecture} architecture and is fabricated on the{' '}
          {props.processSize} process.
        </>
      );
    },
  },
  {
    // Example: The AD199 chip that powers the GPU uses the Ada Lovelace architecture.
    tags: [SpecsTag.Architecture, SpecsTag.Codename],
    component: (props) => {
      return (
        <>
          The {props.codename} chip that powers the GPU uses the{' '}
          {props.architecture} architecture.
        </>
      );
    },
  },
  {
    // Example: The chip that powers the GPU uses the Ada Lovelace architecture,
    //          and is built on the 5 nm process.
    tags: [SpecsTag.Architecture, SpecsTag.ProcessSize],
    component: (props) => {
      return (
        <>
          The chip that powers the GPU uses the {props.architecture}{' '}
          architecture and is fabricated on the {props.processSize} process.
        </>
      );
    },
  },
  {
    // Example: The AD199 chip that powers the GPU is built on the 5 nm process.
    tags: [SpecsTag.Codename, SpecsTag.ProcessSize],
    component: (props) => {
      return (
        <>
          The {props.codename} chip that powers the GPU is fabricated on the{' '}
          {props.processSize} process.
        </>
      );
    },
  },
  {
    // Example: The chip that powers the GPU uses the Ada Lovelace architecture.
    tags: [SpecsTag.Architecture],
    component: (props) => {
      return (
        <>
          The chip that powers the GPU uses the {props.architecture}{' '}
          architecture.
        </>
      );
    },
  },
  {
    // Example: It uses the AD199 chip to power the GPU.
    tags: [SpecsTag.Codename],
    component: (props) => {
      return <>It uses the {props.codename} chip to power the GPU.</>;
    },
  },
  {
    // Example: The chip that powers the GPU is built on the 5 nm process.
    tags: [SpecsTag.ProcessSize],
    component: (props) => {
      return (
        <>
          The chip that powers the GPU is fabricated on the {props.processSize}{' '}
          process.
        </>
      );
    },
  },
);

const IntroParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <IntroAudience /> <IntroReleaseDateAndMsrp /> <IntroArchitecture />
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
