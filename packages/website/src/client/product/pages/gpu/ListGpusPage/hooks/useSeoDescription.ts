import {
  compileContentFunction,
  ContentFunctionParams,
} from 'packages/website/src/client/shared/content';
import { useMemo } from 'react';
import { ListGpusContentTag } from '../content';
import { ListPageContextProps } from '../context';

const seoDescription = compileContentFunction(
  {
    tags: [
      ListGpusContentTag.SortedBestPerformance,
      ListGpusContentTag.OrderedDesc,
    ],
    deps: [],
    hook: (props: ContentFunctionParams) =>
      `The best ${props.company || ''} graphics cards by performance. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    tags: [
      ListGpusContentTag.SortedBestPerformance,
      ListGpusContentTag.OrderedAsc,
    ],
    deps: [],
    hook: (props: ContentFunctionParams) =>
      `The worst ${props.company || ''} graphics cards by performance. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    tags: [ListGpusContentTag.SortedBestValue, ListGpusContentTag.OrderedDesc],
    deps: ['company'],
    hook: (props: ContentFunctionParams) =>
      `The best ${props.company || ''} graphics cards by value. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    tags: [ListGpusContentTag.SortedBestValue, ListGpusContentTag.OrderedAsc],
    deps: ['company'],
    hook: (props: ContentFunctionParams) =>
      `The worst ${props.company || ''} graphics cards by value. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    tags: [
      ListGpusContentTag.SortedReleaseDate,
      ListGpusContentTag.OrderedDesc,
    ],
    hook: (props: ContentFunctionParams) =>
      `The newest ${props.company || ''} graphics cards by performance. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    tags: [ListGpusContentTag.SortedReleaseDate, ListGpusContentTag.OrderedAsc],
    hook: (props: ContentFunctionParams) =>
      `The oldest ${props.company || ''} graphics cards by performance. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
);

export const useSeoDescription = (context: ListPageContextProps) => {
  const { contentParams: params, contentTags: tags } = context;

  return useMemo(() => {
    return seoDescription({ tags, params: params as ContentFunctionParams });
  }, [tags, params]);
};
