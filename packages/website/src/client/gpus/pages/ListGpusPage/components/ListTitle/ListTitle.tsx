import React, { FunctionComponent, useContext } from 'react';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../shared/content';
import { ListGpusContentTag } from '../../content';
import { ListPageContext } from '../../context';

interface ListTitleContentParams extends ContentComponentParams {
  company?: string;
}

const TitleSentence = compileContentComponent(
  {
    tags: [ListGpusContentTag.SortedBestPerformance],
    deps: ['company'],
    component: (props: ListTitleContentParams) => (
      <>Best {props.company} graphics cards by performance</>
    ),
  },
  {
    tags: [ListGpusContentTag.SortedBestValue],
    deps: ['company'],
    component: (props: ListTitleContentParams) => (
      <>Best {props.company} graphics cards by value</>
    ),
  },
  {
    tags: [ListGpusContentTag.SortedBestPerformance],
    component: () => <>Best graphics cards by performance</>,
  },
  {
    tags: [ListGpusContentTag.SortedBestValue],
    component: () => <>Best graphics cards by value</>,
  },
);

const SubtitleSentence = compileContentComponent(
  {
    tags: [ListGpusContentTag.SortedBestPerformance],
    component: () => <>Sorted by highest performance benchmarks</>,
  },
  {
    tags: [ListGpusContentTag.SortedBestValue],
    component: () => <>Sorted by performance per dollar</>,
  },
);

export const ListTitle: FunctionComponent = () => {
  const { contentParams, contentTags } = useContext(ListPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <div>
        <h1 className="md:text-2xl text-3xl mb-0">
          <TitleSentence />
        </h1>

        <p className="text-content-dimmed mb-0">
          <SubtitleSentence />
        </p>
      </div>
    </ContentContext.Provider>
  );
};
