import { ListGpusQuery } from '@pcpartdb/shared';
import { ContentFunctionParams } from 'packages/website/src/app/_common/content/types';
import { compileContentFunction } from 'packages/website/src/app/_common/content/utils/compileContentFunction';
import { buildListContentParams } from './buildListContentParams';
import {
  buildListContentTags,
  ListGpusContentTag,
} from './buildListContentTags';

const pageDescription = compileContentFunction(
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

export const buildPageDescription = (query: ListGpusQuery) => {
  const contentTags = buildListContentTags(query);
  const contentParams = buildListContentParams(query);

  return pageDescription({ tags: contentTags, params: contentParams });
};
