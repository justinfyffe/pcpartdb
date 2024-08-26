'use client';

import { aOrAn } from '@pcpartdb/shared';
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
    // End-of-life GPU with release date and MSRP
    tags: [ProductionStatusTag.EndOfLife, SpecsTag.ReleaseDate, SpecsTag.Msrp],
    deps: ['releaseDate', 'msrp'],
    Component: (props) => {
      return (
        <>
          The {props.name} is an end-of-life {props.marketSegment} graphics card
          that released in {props.releaseDate} with a MSRP of {props.msrp}.
        </>
      );
    },
  },
  {
    // End-of-life GPU with release date
    tags: [ProductionStatusTag.EndOfLife, SpecsTag.ReleaseDate],
    deps: ['releaseDate'],
    Component: (props) => {
      return (
        <>
          The {props.name} is an end-of-life {props.marketSegment} graphics card
          that released in {props.releaseDate}.
        </>
      );
    },
  },
  {
    // End-of-life GPU with MSRP but without release date
    tags: [ProductionStatusTag.EndOfLife, SpecsTag.Msrp],
    deps: ['msrp'],
    Component: (props) => {
      return (
        <>
          The {props.name} is an end-of-life {props.marketSegment} graphics card
          that had an MSRP of {props.msrp}.
        </>
      );
    },
  },
  {
    // End-of-life GPU without release date
    tags: [ProductionStatusTag.EndOfLife],
    deps: [],
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
    // Unreleased GPU that is past the expected launch date and has a MSRP.
    tags: [ProductionStatusTag.Unreleased, SpecsTag.ReleaseDate, SpecsTag.Msrp],
    deps: ['isPastReleaseDate', 'releaseDate', 'msrp'],
    Component: (props) => {
      return (
        <>
          The {props.name} is an unreleased {props.marketSegment} graphics card
          that was planned to launch in {props.releaseDate} with a MSRP of{' '}
          {props.msrp}.
        </>
      );
    },
  },
  {
    // Unreleased GPU that is past the expected launch date.
    tags: [ProductionStatusTag.Unreleased, SpecsTag.ReleaseDate],
    deps: ['isPastReleaseDate', 'releaseDate'],
    Component: (props) => {
      return (
        <>
          The {props.name} is an unreleased {props.marketSegment} graphics card
          that was planned to launch in {props.releaseDate}.
        </>
      );
    },
  },
  {
    // Unreleased GPU with a release date and a MSRP.
    tags: [ProductionStatusTag.Unreleased, SpecsTag.ReleaseDate, SpecsTag.Msrp],
    deps: ['releaseDate', 'msrp'],
    Component: (props) => {
      return (
        <>
          The {props.name} is an unreleased {props.marketSegment} graphics card
          that is expected to launch in {props.releaseDate} with a MSRP of{' '}
          {props.msrp}.
        </>
      );
    },
  },
  {
    // Unreleased GPU with a release date.
    tags: [ProductionStatusTag.Unreleased, SpecsTag.ReleaseDate],
    deps: ['releaseDate'],
    Component: (props) => {
      return (
        <>
          The {props.name} is an unreleased {props.marketSegment} graphics card
          that is expected to launch in {props.releaseDate}.
        </>
      );
    },
  },
  {
    // Unreleased GPU without a release date but has a MSRP.
    tags: [ProductionStatusTag.Unreleased, SpecsTag.Msrp],
    deps: [],
    Component: (props) => {
      return (
        <>
          The {props.name} is an unreleased {props.marketSegment} graphics card
          with a MSRP of {props.msrp}.
        </>
      );
    },
  },
  {
    // Unreleased GPU without a release date.
    tags: [ProductionStatusTag.Unreleased],
    deps: [],
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
    // GPU with release date in the past and a MSRP.
    tags: [SpecsTag.ReleaseDate, SpecsTag.Msrp],
    deps: ['isPastReleaseDate', 'releaseDate', 'msrp'],
    Component: (props) => {
      return (
        <>
          The {props.name} is {aOrAn(props.marketSegment || 'graphics')}{' '}
          {props.marketSegment} graphics card that launched in{' '}
          {props.releaseDate} with a MSRP of {props.msrp}.
        </>
      );
    },
  },
  {
    // GPU with release date in the past.
    tags: [SpecsTag.ReleaseDate],
    deps: ['isPastReleaseDate', 'releaseDate'],
    Component: (props) => {
      return (
        <>
          The {props.name} is {aOrAn(props.marketSegment || 'graphics')}{' '}
          {props.marketSegment} graphics card that launched in{' '}
          {props.releaseDate}.
        </>
      );
    },
  },
  {
    // GPU with a release date and MSRP.
    tags: [SpecsTag.ReleaseDate, SpecsTag.Msrp],
    deps: ['releaseDate', 'msrp'],
    Component: (props) => {
      return (
        <>
          The {props.name} is {aOrAn(props.marketSegment || 'graphics')}{' '}
          {props.marketSegment} graphics card that launches in{' '}
          {props.releaseDate} with a MSRP of {props.msrp}.
        </>
      );
    },
  },
  {
    // GPU with a release date.
    tags: [SpecsTag.ReleaseDate],
    deps: ['releaseDate'],
    Component: (props) => {
      return (
        <>
          The {props.name} is {aOrAn(props.marketSegment || 'graphics')}{' '}
          {props.marketSegment} graphics card that launches in{' '}
          {props.releaseDate}.
        </>
      );
    },
  },
  {
    // GPU without release date but has a MSRP.
    tags: [SpecsTag.Msrp],
    deps: ['msrp'],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompany} is{' '}
          {aOrAn(props.marketSegment || 'graphics')} graphics card by{' '}
          {props.company} with a MSRP of {props.msrp}.
        </>
      );
    },
  },
  {
    // GPU without release date and MSRP.
    tags: [],
    deps: [],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompany} is{' '}
          {aOrAn(props.marketSegment || 'graphics')} graphics card by{' '}
          {props.company}.
        </>
      );
    },
  },
);

const IntroSentence2 = compileContentComponent(
  {
    // GPU with a microarchitecture, codename, and process size.
    tags: [SpecsTag.Architecture, SpecsTag.Codename, SpecsTag.ProcessSize],
    deps: ['architecture', 'codename', 'processSize'],
    Component: (props) => {
      return (
        <>
          It is built on the {props.architecture} GPU microarchitecture
          (codename {props.codename}) and is manufactured on a{' '}
          {props.processSize} process.
        </>
      );
    },
  },
  {
    // GPU with a microarchitecture and codename.
    tags: [SpecsTag.Architecture, SpecsTag.Codename],
    deps: ['architecture', 'codename'],
    Component: (props) => {
      return (
        <>
          It is built on the {props.architecture} GPU microarchitecture
          (codename {props.codename}).
        </>
      );
    },
  },
  {
    // GPU with a microarchitecture and process size.
    tags: [SpecsTag.Architecture, SpecsTag.ProcessSize],
    deps: ['architecture', 'processSize'],
    Component: (props) => {
      return (
        <>
          {' '}
          It is built on the {props.architecture} GPU microarchitecture and is
          manufactured on a {props.processSize} process.
        </>
      );
    },
  },
  {
    // GPU with a microarchitecture
    tags: [SpecsTag.Architecture],
    deps: ['architecture'],
    Component: (props) => {
      return (
        <>It is built on the {props.architecture} GPU microarchitecture.</>
      );
    },
  },
);

const IntroParagraph = compileContentComponent({
  tags: [],
  deps: [],
  Component: () => (
    <>
      <p>
        <IntroSentence1 /> <IntroSentence2 />
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
