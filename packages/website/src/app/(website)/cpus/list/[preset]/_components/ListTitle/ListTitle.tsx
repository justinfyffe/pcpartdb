'use client';

import {
  getProductBenchmarkName,
  getProductBenchmarkShortName,
  ProductType,
} from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import React, { FunctionComponent, useMemo } from 'react';
import { buildListContentParams } from '../../_content/buildListContentParams';
import {
  buildListContentTags,
  ListCpusContentTag,
} from '../../_content/buildListContentTags';
import { useListContext } from '../../ListProvider';

const TitleSentence = compileContentComponent(
  {
    tags: [ListCpusContentTag.SortedBestPerformance],
    deps: [],
    Component: (props) => (
      <>
        {props.bestOrWorstTitle} {props.marketSegment} {props.company} CPUs by
        performance
      </>
    ),
  },
  {
    tags: [ListCpusContentTag.SortedBestValue],
    deps: [],
    Component: (props) => (
      <>
        {props.bestOrWorstTitle} {props.marketSegment} {props.company} CPUs by
        performance per dollar
      </>
    ),
  },
  {
    tags: [ListCpusContentTag.SortedReleaseDate],
    Component: (props) => (
      <>
        {props.newestOrOldestTitle} {props.marketSegment} {props.company} CPUs
        by release date
      </>
    ),
  },
);

const SortedSentence = compileContentComponent(
  {
    tags: [ListCpusContentTag.SortedBestPerformance],
    Component: (props) => (
      <>Sorted by {props.preferredBenchmarkName} performance.</>
    ),
  },
  {
    tags: [ListCpusContentTag.SortedBestValue],
    Component: (props) => (
      <>
        Sorted by {props.preferredBenchmarkName} performance per dollar (MSRP).
      </>
    ),
  },
  {
    tags: [ListCpusContentTag.SortedReleaseDate],
    Component: () => <>Sorted by release date</>,
  },
);

const FilteredSentence = compileContentComponent({
  tags: [],
  deps: ['filtersList'],
  Component: (props) => <>Filtered to {props.filtersList} processors.</>,
});

export const ListTitle: FunctionComponent = () => {
  const { query } = useListContext();
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);

  const contentTags = useMemo(() => buildListContentTags(query), [query]);
  const contentParams = useMemo(() => {
    return {
      ...buildListContentParams(query),
      preferredBenchmarkName: getProductBenchmarkName(preferredBenchmark),
      preferredBenchmarkShortName:
        getProductBenchmarkShortName(preferredBenchmark),
    };
  }, [preferredBenchmark, query]);

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <div>
        <h1 className="md:text-2xl text-3xl mb-0">
          <TitleSentence />
        </h1>

        <p className="mb-0">
          <SortedSentence /> <FilteredSentence />
        </p>
      </div>
    </ContentProvider>
  );
};
