import { GpuSort } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../shared/content';
import { formatGpuCompany } from '../../../../gpu-utils';
import { ListPageContext } from '../../context';

interface ListTitleContentParams extends ContentComponentParams {
  company?: string;
}

const TitleSentence = compileContentComponent(
  {
    filters: [GpuSort.PerformanceRating],
    deps: ['company'],
    component: (props: ListTitleContentParams) => (
      <>Best {props.company} graphics cards by performance</>
    ),
  },
  {
    filters: [GpuSort.ValueRating],
    deps: ['company'],
    component: (props: ListTitleContentParams) => (
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

const SubtitleSentence = compileContentComponent(
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

  const contextValue = useMemo(() => {
    const filters = {
      [query.orderBy?.sort ?? GpuSort.PerformanceRating]: true,
    };

    const params: ListTitleContentParams = {
      company:
        query.filter?.company?.length === 1
          ? formatGpuCompany(query.filter?.company[0])
          : null,
    };

    return { filters, params };
  }, [query.filter?.company, query.orderBy?.sort]);

  return (
    <ContentContext.Provider value={contextValue}>
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
