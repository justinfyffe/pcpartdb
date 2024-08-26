'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const CoresAndClocksTitle = compileContentComponent(
  {
    tags: [SpecsTag.Cores],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.Threads],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    deps: ['pCores', 'eCores'],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.Clock],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.BoostClock],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.UnlockedMultiplier],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
  {
    tags: [SpecsTag.LockedMultiplier],
    Component: (props) => <h3>Cores and Clock Speeds</h3>,
  },
);

const CoresAndClocksSentence1 = compileContentComponent(
  {
    // CPU with multiple cores and threads
    tags: [SpecsTag.Cores, SpecsTag.Threads],
    deps: ['cores', 'threads', 'isMultiCore'],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} features {props.cores} total cores
        which can process {props.threads} threads simultaneously. The
        multi-threading capability allows the CPU to execute multiple
        computational tasks in parallel.
      </>
    ),
  },
  {
    // CPU with a single core and multiple threads
    tags: [SpecsTag.Cores, SpecsTag.Threads],
    deps: ['cores', 'threads', 'isSingleCore', 'isMultiThread'],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} is a single core CPU, but is able to
        process {props.threads} threads simultaneously. The multi-threading
        capability allows the CPU to execute multiple computational tasks in
        parallel.
      </>
    ),
  },
  {
    // CPU with single core and thread
    tags: [SpecsTag.Cores, SpecsTag.Threads],
    deps: ['cores', 'threads', 'isSingleCore', 'isSingleThread'],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} is a single-core and single-threaded
        CPU, making it not capable of processing multiple computational tasks in
        parallel.
      </>
    ),
  },
  {
    // CPU with multiple cores (but no thread data)
    tags: [SpecsTag.Cores],
    deps: ['cores', 'isMultiCore'],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} features {props.cores} total cores
        which can handle multiple processes simultaneously. The multi-core
        system allows the CPU to divide computational tasks and execute them in
        parallel.
      </>
    ),
  },
  {
    // CPU with single cores (but no thread data)
    tags: [SpecsTag.Cores],
    deps: ['cores', 'isSingleCore'],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} is a single-core CPU, making it not
        capable of processing multiple computational tasks in parallel.
      </>
    ),
  },
  {
    // CPU with multiple threads (but no core data)
    tags: [SpecsTag.Cores],
    deps: ['threads', 'isMultiThread'],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} is able to process {props.threads}{' '}
        threads simultaneously. The multi-thread system allows programs to split
        processes into smaller tasks and execute them concurrently.
      </>
    ),
  },
  {
    // CPU with multiple threads (but no core data)
    tags: [SpecsTag.Cores],
    deps: ['threads', 'isSingleThread'],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} is a single-threaded CPU, making it
        not capable of processing multiple computational tasks in parallel.
      </>
    ),
  },
);

const CoresAndClocksSentence2 = compileContentComponent(
  {
    // CPU cores with  p-cores, and e-cores
    tags: [SpecsTag.Cores],
    deps: ['cores', 'pCores', 'eCores'],
    Component: (props) => {
      return (
        <>
          The {props.cores} cores consist of {props.pCores} P-Cores and{' '}
          {props.eCores} E-Cores. P-Cores are designed for high-performance
          tasks and E-Cores are intended for efficiency and lighter tasks.
        </>
      );
    },
  },
  {
    // P-cores, and e-cores
    tags: [],
    deps: ['pCores', 'eCores'],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompanyNoTags} includes {props.pCores} P-Cores
          and {props.eCores} E-Cores. P-Cores are designed for high-performance
          tasks and E-Cores are intended for efficiency and lighter tasks.
        </>
      );
    },
  },
);

const CoresAndClocksSentence3 = compileContentComponent(
  {
    // CPU with a clock and boost clock
    tags: [SpecsTag.Clock, SpecsTag.BoostClock],
    deps: ['clock', 'boostClock'],
    Component: (props) => {
      return (
        <>
          The base clock speed of the CPU is {props.clock}, and it can boost up
          to {props.boostClock} under heavy workloads. Higher clock speeds
          result in better performance for the same microarchitecture.
        </>
      );
    },
  },
  {
    // CPU with only a clock
    tags: [SpecsTag.Clock],
    deps: ['clock'],
    Component: (props) => {
      return (
        <>
          The base clock speed of the CPU is {props.clock}. Higher clock speeds
          result in higher performance for the same microarchitecture.
        </>
      );
    },
  },
  {
    // CPU with only a boost clock
    tags: [SpecsTag.BoostClock],
    deps: ['boostClock'],
    Component: (props) => {
      return (
        <>
          The clock speed of the CPU can reach up to {props.clock} under heavy
          workloads. Higher clock speeds result in better performance for the
          same microarchitecture.
        </>
      );
    },
  },
);

const CoresAndClocksSentence4 = compileContentComponent(
  {
    // CPUs with an unlocked multiplier
    tags: [SpecsTag.UnlockedMultiplier],
    deps: [],
    Component: (props) => (
      <>
        The multiplier is unlocked, enabling overclocking for those seeking to
        push the CPU&apos;s performance further.
      </>
    ),
  },
  {
    // CPUs with a locked multiplier
    tags: [SpecsTag.LockedMultiplier],
    Component: (props) => (
      <>
        The multiplier is locked, making it incapable of overclocking for
        pushing performance further.
      </>
    ),
  },
);

const CoresAndClocksParagraph = compileContentComponent(
  {
    tags: [SpecsTag.Cores],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.Threads],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    deps: ['pCores', 'eCores'],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.Clock],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.BoostClock],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.UnlockedMultiplier],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.LockedMultiplier],
    Component: (props) => (
      <p>
        <CoresAndClocksSentence1 /> <CoresAndClocksSentence2 />{' '}
        <CoresAndClocksSentence3 /> <CoresAndClocksSentence4 />
      </p>
    ),
  },
);

interface CoresAndClocksBlurbProps {
  index?: number;
}

export const CoresAndClocksBlurb: FunctionComponent<
  CoresAndClocksBlurbProps
> = (props) => {
  const { contentTags, contentParams } = useProductContent(props.index);

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <CoresAndClocksTitle />
      <CoresAndClocksParagraph />
    </ContentProvider>
  );
};
