import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { FunctionComponent, useContext } from 'react';
import { ListCpusContentTag } from '../../content/getContentTags';
import { ListPageContext } from '../../context/ListPageContext';

const TitleSentence = compileContentComponent(
  {
    tags: [ListCpusContentTag.SortedBestPerformance],
    deps: [],
    component: (props) => (
      <>
        {props.bestOrWorstTitle} {props.marketSegment} {props.company} CPUs by
        performance
      </>
    ),
  },
  {
    tags: [ListCpusContentTag.SortedBestValue],
    deps: [],
    component: (props) => (
      <>
        {props.bestOrWorstTitle} {props.marketSegment} {props.company} CPUs by
        performance per dollar
      </>
    ),
  },
  {
    tags: [ListCpusContentTag.SortedReleaseDate],
    component: (props) => (
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
    component: () => <>Sorted by performance benchmarks.</>,
  },
  {
    tags: [ListCpusContentTag.SortedBestValue],
    component: () => <>Sorted by performance per dollar</>,
  },
  {
    tags: [ListCpusContentTag.SortedReleaseDate],
    component: () => <>Sorted by release date</>,
  },
);

const FilteredSentence = compileContentComponent({
  tags: [],
  deps: ['filtersList'],
  component: (props) => <>Filtered to {props.filtersList} processors.</>,
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
