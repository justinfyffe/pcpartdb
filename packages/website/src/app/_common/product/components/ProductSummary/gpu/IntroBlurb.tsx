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
    // Example: The Geforce RTX 3070 is an unreleased desktop graphics card by NVIDIA.
    tags: [ProductionStatusTag.Unreleased],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompany} is an unreleased {props.marketSegment}{' '}
          graphics card by {props.company}.
        </>
      );
    },
  },
  {
    // Example: The Geforce RTX 3070 is an end-of-life desktop graphics card by NVIDIA.
    tags: [ProductionStatusTag.EndOfLife],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompany} is an end-of-life {props.marketSegment}{' '}
          graphics card by {props.company}.
        </>
      );
    },
  },
  {
    // Example: The Geforce RTX 3070 is an integrated graphics card by NVIDIA.
    tags: [MarketSegmentTag.Integrated],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompany} is an integrated graphics card by{' '}
          {props.company}.
        </>
      );
    },
  },
  {
    // Example: The Geforce RTX 3070 is a desktop graphics card by NVIDIA.
    tags: [],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompany} is a {props.marketSegment} graphics card
          by {props.company}.
        </>
      );
    },
  },
);

const IntroReleaseDateAndMsrp = compileContentComponent(
  {
    // Example: It is expected to launch in Q4 2099 with a price of $999 (MSRP).
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
    // Example: It has a launch price of $999 (MSRP).
    tags: [SpecsTag.Msrp],
    Component: (props) => {
      return <>It has a suggested retail price of {props.msrp}.</>;
    },
  },
  {
    // Example: It was planned to launch in Q2 1999.
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

const IntroArchitecture = compileContentComponent(
  {
    // Example: The AD199 chip that powers the GPU uses the Ada Lovelace architecture,
    //          and is built on the 5 nm process.
    tags: [SpecsTag.Architecture, SpecsTag.Codename, SpecsTag.ProcessSize],
    Component: (props) => {
      return (
        <>
          Its {props.codename} chip that powers the GPU uses the{' '}
          {props.architecture} architecture and is fabricated on the{' '}
          {props.processSize} process.
        </>
      );
    },
  },
  {
    // Example: The AD199 chip that powers the GPU uses the Ada Lovelace architecture.
    tags: [SpecsTag.Architecture, SpecsTag.Codename],
    Component: (props) => {
      return (
        <>
          Its {props.codename} chip that powers the GPU uses the{' '}
          {props.architecture} architecture.
        </>
      );
    },
  },
  {
    // Example: The chip that powers the GPU uses the Ada Lovelace architecture,
    //          and is built on the 5 nm process.
    tags: [SpecsTag.Architecture, SpecsTag.ProcessSize],
    Component: (props) => {
      return (
        <>
          Its chip that powers the GPU uses the {props.architecture}{' '}
          architecture and is fabricated on the {props.processSize} process.
        </>
      );
    },
  },
  {
    // Example: The AD199 chip that powers the GPU is built on the 5 nm process.
    tags: [SpecsTag.Codename, SpecsTag.ProcessSize],
    Component: (props) => {
      return (
        <>
          Its {props.codename} chip that powers the GPU is fabricated on the{' '}
          {props.processSize} process.
        </>
      );
    },
  },
  {
    // Example: The chip that powers the GPU uses the Ada Lovelace architecture.
    tags: [SpecsTag.Architecture],
    Component: (props) => {
      return (
        <>
          Its chip that powers the GPU uses the {props.architecture}{' '}
          architecture.
        </>
      );
    },
  },
  {
    // Example: It uses the AD199 chip to power the GPU.
    tags: [SpecsTag.Codename],
    Component: (props) => {
      return <>It uses the {props.codename} chip to power the GPU.</>;
    },
  },
  {
    // Example: The chip that powers the GPU is built on the 5 nm process.
    tags: [SpecsTag.ProcessSize],
    Component: (props) => {
      return (
        <>
          Its chip that powers the GPU is fabricated on the {props.processSize}{' '}
          process.
        </>
      );
    },
  },
);

const IntroParagraph = compileContentComponent({
  tags: [],
  deps: [],
  Component: () => (
    <p>
      <IntroAudience /> <IntroReleaseDateAndMsrp /> <IntroArchitecture />
    </p>
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
