import { GpuSort } from '@pcpartdb/database';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@pcpartdb/website/client/shared/content';
import React, { FunctionComponent, useContext } from 'react';
import { ListPageContext } from '../../context';

interface ListTitleContentParams extends ContentParams {
  company?: string;
}

const TitleSentence1 = compileContent(
  {
    filters: [GpuSort.PerformanceRating],
    deps: ['company'],
    component: (props: ContentParams) => (
      <>Best {props.company} graphics cards by performance</>
    ),
  },
  {
    filters: [GpuSort.ValueRating],
    deps: ['company'],
    component: (props: ContentParams) => (
      <>Best {props.company} graphics cards by value</>
    ),
  },
  {
    filters: [GpuSort.PerformanceRating],
    component: () => <>Best graphics cards by performance</>,
  },
  {
    filters: [GpuSort.ValueRating],
    component: () => <>Best graphics cards by value</>,
  },
);

const SubtitleSentence1 = compileContent(
  {
    filters: [GpuSort.PerformanceRating],
    component: () => <>Sorted by highest performance benchmarks</>,
  },
  {
    filters: [GpuSort.ValueRating],
    component: () => <>Sorted by performance per dollar</>,
  },
);

export const ListTitle: FunctionComponent = () => {
  const { query } = useContext(ListPageContext);

  const filters = {
    [query.orderBy?.sort ?? GpuSort.PerformanceRating]: true,
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
