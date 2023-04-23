import { GpuSort } from '@pcpartdb/shared';
import {
  compileContentFunction,
  ContentFunctionParams,
} from 'packages/website/src/client/shared/content';
import { useMemo } from 'react';
import { ListPageContextProps } from '../context';

const seoDescription = compileContentFunction(
  {
    tags: [GpuSort.PerformanceRating],
    deps: ['company'],
    hook: (props: ContentFunctionParams) =>
      `View a list of the best ${props.company} graphics cards by performance. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    tags: [GpuSort.ValueRating],
    deps: ['company'],
    hook: (props: ContentFunctionParams) =>
      `View a list of the best ${props.company} graphics cards by value. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    tags: [GpuSort.PerformanceRating],
    hook: () =>
      'View a list of the best graphics cards by performance. ' +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    tags: [GpuSort.ValueRating],
    hook: () =>
      'View a list of the best graphics cards by value. ' +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
);

export const useSeoDescription = (context: ListPageContextProps) => {
  const { contentParams: params, contentTags: tags } = context;

  return useMemo(() => {
    return seoDescription({ tags, params: params as ContentFunctionParams });
  }, [tags, params]);
};
