'use client';

import {
  getProductBenchmarkName,
  getProductBenchmarkShortName,
  ProductType,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
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
        We&apos;ve ranked the CPUs in our database based on their average
        performance scores for the{' '}
        <Button
          variant={ButtonVariant.Link}
          onClick={props.showPreferredBenchmarkDialog}
          className="underline decoration-dotted decoration-1"
        >
          {props.preferredBenchmarkName}
        </Button>{' '}
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
        We&apos;ve ranked the CPUs in our database based on their performance
        per dollar for the{' '}
        <Button
          variant={ButtonVariant.Link}
          onClick={props.showPreferredBenchmarkDialog}
          className="underline decoration-dotted decoration-1"
        >
          {props.preferredBenchmarkName}
        </Button>{' '}
        benchmark test. Processors without a benchmark or MSRP are excluded from
        this list. Use the filters to further narrow your search.
      </>
    ),
  },
  {
    tags: [ListCpusContentTag.SortedReleaseDate],
    Component: (props) => (
      <>
        We&apos;ve listed the CPUs in our database by their release date.
        Processors without a release date are excluded from this list. Use the
        filters to further narrow your search.
      </>
    ),
  },
);

export const ListDescription: FunctionComponent = () => {
  const { query } = useListContext();
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);

  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Cpu,
    hardReload: true,
  });

  const contentTags = useMemo(() => buildListContentTags(query), [query]);
  const contentParams = useMemo(() => {
    return {
      ...buildListContentParams(query),
      preferredBenchmarkName: getProductBenchmarkName(preferredBenchmark),
      preferredBenchmarkShortName:
        getProductBenchmarkShortName(preferredBenchmark),
      showPreferredBenchmarkDialog,
    };
  }, [preferredBenchmark, query, showPreferredBenchmarkDialog]);

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="mb-0">
        <DescriptionSentence />
      </p>
    </ContentProvider>
  );
};
