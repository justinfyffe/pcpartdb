'use client';

import {
  getProductBenchmarkName,
  getProductBenchmarkShortName,
  ProductType,
} from '@pcpartdb/shared';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { PreferredBenchmarkDialogTrigger } from 'packages/website/src/app/_common/product/components/PreferredBenchmarkDialog/PreferredBenchmarkDialog';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import React, { FunctionComponent, useMemo } from 'react';
import { buildListContentParams } from '../../_content/buildListContentParams';
import {
  buildListContentTags,
  ListCpusContentTag,
} from '../../_content/buildListContentTags';
import { useListContext } from '../../ListProvider';

const DescriptionSentence = compileContentComponent(
  {
    tags: [ListCpusContentTag.SortedBestPerformance],
    deps: [],
    Component: (props) => (
      <>
        We have ranked the CPUs in our database based on their average
        performance scores for the{' '}
        <PreferredBenchmarkDialogTrigger
          buttonVariant={ButtonVariant.LinkDialog}
          productType={ProductType.Cpu}
          hardReload
        >
          {props.preferredBenchmarkName}
        </PreferredBenchmarkDialogTrigger>{' '}
        benchmark test. Processors without a benchmark are excluded from this
        list. Use the filters to further narrow your search.
      </>
    ),
  },
  {
    tags: [ListCpusContentTag.SortedBestValue],
    deps: [],
    Component: (props) => (
      <>
        We have ranked the CPUs in our database based on their performance per
        dollar for the{' '}
        <PreferredBenchmarkDialogTrigger
          buttonVariant={ButtonVariant.LinkDialog}
          productType={ProductType.Cpu}
          hardReload
        >
          {props.preferredBenchmarkName}
        </PreferredBenchmarkDialogTrigger>{' '}
        benchmark test. Processors without a benchmark or MSRP are excluded from
        this list. Use the filters to further narrow your search.
      </>
    ),
  },
  {
    tags: [ListCpusContentTag.SortedReleaseDate],
    Component: () => (
      <>
        We have sorted the CPUs in our database by their release date.
        Processors without a release date are excluded from this list. Use the
        filters to further narrow your search.
      </>
    ),
  },
);

export const ListDescription: FunctionComponent = () => {
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
      <p className="mb-0">
        <DescriptionSentence />
      </p>
    </ContentProvider>
  );
};
