import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { PartSort } from '@shared/part';
import React, { FunctionComponent, useContext } from 'react';
import { ListPageContext } from '../../context';

interface ListTitleContentParams extends ContentParams {
  company?: string;
}

const TitleSentence1 = compileContent(
  {
    filters: [PartSort.PerformanceRating],
    deps: ['company'],
    component: (props: ContentParams) => (
      <>Best {props.company} graphics cards by performance</>
    ),
  },
  {
    filters: [PartSort.ValueRating],
    deps: ['company'],
    component: (props: ContentParams) => (
      <>Best {props.company} graphics cards by value</>
    ),
  },
  {
    filters: [PartSort.PerformanceRating],
    component: () => <>Best graphics cards by performance</>,
  },
  {
    filters: [PartSort.ValueRating],
    component: () => <>Best graphics cards by value</>,
  },
);

const SubtitleSentence1 = compileContent(
  {
    filters: [PartSort.PerformanceRating],
    component: () => <>Sorted by highest performance benchmarks</>,
  },
  {
    filters: [PartSort.ValueRating],
    component: () => <>Sorted by performance per dollar</>,
  },
);

export const ListTitle: FunctionComponent = () => {
  const { query } = useContext(ListPageContext);

  const filters = {
    [query.orderBy?.sort ?? PartSort.PerformanceRating]: true,
  };

  const params: ListTitleContentParams = {
    company:
      query.filter?.company?.length === 1
        ? query.filter?.company[0].toUpperCase()
        : null,
  };

  return (
    <ContentContext.Provider value={{ filters, params }}>
      <div>
        <h1 className="md:text-2xl text-3xl mb-0">
          <TitleSentence1 />
        </h1>

        <p className="text-content-dimmed mb-0">
          <SubtitleSentence1 />
        </p>
      </div>
    </ContentContext.Provider>
  );
};
