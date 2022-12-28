import { compileContent } from '@client/shared/content';
import { ProductsSort } from '@shared/product';
import React from 'react';

export const TitleSentence1 = compileContent(
  {
    filters: [ProductsSort.PerformanceRating],
    deps: ['company'],
    component: (props) => (
      <>Best {props.company} Graphics Cards by Performance</>
    ),
  },
  {
    filters: [ProductsSort.ValueRating],
    deps: ['company'],
    component: (props) => <>Best {props.company} Graphics Cards by Value</>,
  },
  {
    filters: [ProductsSort.PerformanceRating],
    component: () => <>Best Graphics Cards by Performance</>,
  },
  {
    filters: [ProductsSort.ValueRating],
    component: () => <>Best Graphics Cards by Value</>,
  },
);

export const SubtitleSentence1 = compileContent(
  {
    filters: [ProductsSort.PerformanceRating],
    component: (props) => <>Sorted by highest performance benchmarks</>,
  },
  {
    filters: [ProductsSort.ValueRating],
    component: (props) => <>Sorted by performance per dollar</>,
  },
);
