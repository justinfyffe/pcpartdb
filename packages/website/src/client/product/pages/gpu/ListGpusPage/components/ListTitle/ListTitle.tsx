import React, { FunctionComponent, useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ListGpusContentTag } from '../../content';
import { ListPageContext } from '../../context';

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
    component: () => <>Sorted by performance benchmarks.</>,
  },
  {
    tags: [ListGpusContentTag.SortedBestValue],
    component: () => <>Sorted by performance per dollar</>,
  },
  {
    tags: [ListGpusContentTag.SortedReleaseDate],
    component: () => <>Sorted by release date</>,
  },
);

const FilteredSentence = compileContentComponent({
  tags: [],
  deps: ['filtersList'],
  component: (props) => <>Filtered to {props.filtersList} graphics cards.</>,
});

export const ListTitle: FunctionComponent = () => {
  const { contentParams, contentTags } = useContext(ListPageContext);
  const context = { tags: contentTags, params: contentParams };

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
