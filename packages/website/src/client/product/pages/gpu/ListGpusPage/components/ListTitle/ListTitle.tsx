import {
  getProductBenchmarkName,
  getProductBenchmarkShortName,
  ProductType,
} from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, { FunctionComponent, useContext } from 'react';
import { ListGpusContentTag } from '../../content/getContentTags';
import { ListPageContext } from '../../context/ListPageContext';

const TitleSentence = compileContentComponent(
  {
    tags: [ListGpusContentTag.SortedBestPerformance],
    deps: [],
    component: (props) => (
      <>
        {props.bestOrWorstTitle} {props.marketSegment} {props.company} GPUs by
        performance
      </>
    ),
  },
  {
    tags: [ListGpusContentTag.SortedBestValue],
    deps: [],
    component: (props) => (
      <>
        {props.bestOrWorstTitle} {props.marketSegment} {props.company} GPUs by
        performance per dollar
      </>
    ),
  },
  {
    tags: [ListGpusContentTag.SortedReleaseDate],
    component: (props) => (
      <>
        {props.newestOrOldestTitle} {props.marketSegment} {props.company} GPUs
        by release date
      </>
    ),
  },
);

const SortedSentence = compileContentComponent(
  {
    tags: [ListGpusContentTag.SortedBestPerformance],
    component: (props) => (
      <>Sorted by {props.preferredBenchmarkName} performance.</>
    ),
  },
  {
    tags: [ListGpusContentTag.SortedBestValue],
    component: (props) => (
      <>
        Sorted by {props.preferredBenchmarkName} performance per dollar (MSRP).
      </>
    ),
  },
  {
    tags: [ListGpusContentTag.SortedReleaseDate],
    component: () => <>Sorted by release date.</>,
  },
);

const FilteredSentence = compileContentComponent({
  tags: [],
  deps: ['filtersList'],
  component: (props) => <>Filtered to {props.filtersList} graphics cards.</>,
});

export const ListTitle: FunctionComponent = () => {
  const { contentParams, contentTags } = useContext(ListPageContext);
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);

  const context = {
    tags: contentTags,
    params: {
      ...contentParams,
      preferredBenchmarkName: getProductBenchmarkName(preferredBenchmark),
      preferredBenchmarkShortName:
        getProductBenchmarkShortName(preferredBenchmark),
    },
  };

  return (
    <ContentContext.Provider value={context}>
      <div>
        <h1 className="md:text-2xl text-3xl mb-0">
          <TitleSentence />
        </h1>

        <p className="text-dimmed mb-0">
          <SortedSentence /> <FilteredSentence />
        </p>
      </div>
    </ContentContext.Provider>
  );
};
