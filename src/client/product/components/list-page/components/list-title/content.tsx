import { compileContent } from '@client/shared/content';
import { ProductsSort } from '@shared/product';
import React from 'react';

export const TitleSentence1 = compileContent(
  {
    filters: [ProductsSort.PerformanceRating],
    component: (props) => <>Best Graphics Cards by Performance</>,
  },
  {
    filters: [ProductsSort.ValueRating],
    component: (props) => <>Best Graphics Cards by Value</>,
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
