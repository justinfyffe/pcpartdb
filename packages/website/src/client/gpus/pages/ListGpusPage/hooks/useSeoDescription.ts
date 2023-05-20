import { ListGpusSort } from '@pcpartdb/shared';
import {
  compileContentFunction,
  ContentFunctionParams,
} from 'packages/website/src/client/shared/content';
import { useMemo } from 'react';
import { ListPageContextProps } from '../context';

const seoDescription = compileContentFunction(
  {
    tags: [ListGpusSort.PerformanceRating],
    deps: ['company'],
    hook: (props: ContentFunctionParams) =>
      `The best ${props.company} graphics cards by performance. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    tags: [ListGpusSort.ValueRating],
    deps: ['company'],
    hook: (props: ContentFunctionParams) =>
      `The best ${props.company} graphics cards by value. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    tags: [ListGpusSort.PerformanceRating],
    hook: () =>
      'The best graphics cards by performance. ' +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    tags: [ListGpusSort.ValueRating],
    hook: () =>
      'The best graphics cards by value. ' +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    tags: [],
    hook: () =>
      'The best graphics cards by performance. ' +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
);

export const useSeoDescription = (context: ListPageContextProps) => {
  const { contentParams: params, contentTags: tags } = context;

  return useMemo(() => {
    return seoDescription({ tags, params: params as ContentFunctionParams });
  }, [tags, params]);
};
