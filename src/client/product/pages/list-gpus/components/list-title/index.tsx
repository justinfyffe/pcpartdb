import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import { ProductsSort } from '@shared/product';
import React, { FunctionComponent, useContext } from 'react';
import { ListPageContext } from '../../context';

interface ListTitleContentParams extends ContentParams {
  company?: string;
}

const TitleSentence1 = compileContent(
  {
    filters: [ProductsSort.PerformanceRating],
    deps: ['company'],
    component: (props: ContentParams) => (
      <>Best {props.company} graphics cards by performance</>
    ),
  },
  {
    filters: [ProductsSort.ValueRating],
    deps: ['company'],
    component: (props: ContentParams) => (
      <>Best {props.company} graphics cards by value</>
    ),
  },
  {
    filters: [ProductsSort.PerformanceRating],
    component: () => <>Best graphics cards by performance</>,
  },
  {
    filters: [ProductsSort.ValueRating],
    component: () => <>Best graphics cards by value</>,
  },
);

const SubtitleSentence1 = compileContent(
  {
    filters: [ProductsSort.PerformanceRating],
    component: () => <>Sorted by highest performance benchmarks</>,
  },
  {
    filters: [ProductsSort.ValueRating],
    component: () => <>Sorted by performance per dollar</>,
  },
);

export const ListTitle: FunctionComponent = () => {
  const { query } = useContext(ListPageContext);

  const filters = {
    [query.orderBy?.sort ?? ProductsSort.PerformanceRating]: true,
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
