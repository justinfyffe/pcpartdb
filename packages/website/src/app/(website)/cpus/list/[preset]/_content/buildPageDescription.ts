import { ListCpusQuery } from '@pcpartdb/shared';
import { ContentFunctionParams } from 'packages/website/src/app/_common/content/types';
import { compileContentFunction } from 'packages/website/src/app/_common/content/utils/compileContentFunction';
import { buildListContentParams } from './buildListContentParams';
import {
  buildListContentTags,
  ListCpusContentTag,
} from './buildListContentTags';

const pageDescription = compileContentFunction(
  {
    tags: [
      ListCpusContentTag.SortedBestPerformance,
      ListCpusContentTag.OrderedDesc,
    ],
    deps: [],
    hook: (props: ContentFunctionParams) =>
      `The best ${props.company || ''} CPUs by performance. ` +
      'Our database of processors will help you choose the best CPU for your computer.',
  },
  {
    tags: [
      ListCpusContentTag.SortedBestPerformance,
      ListCpusContentTag.OrderedAsc,
    ],
    deps: [],
    hook: (props: ContentFunctionParams) =>
      `The worst ${props.company || ''} CPUs by performance. ` +
      'Our database of processors will help you choose the best CPU for your computer.',
  },
  {
    tags: [ListCpusContentTag.SortedBestValue, ListCpusContentTag.OrderedDesc],
    deps: ['company'],
    hook: (props: ContentFunctionParams) =>
      `The best ${props.company || ''} CPUs by value. ` +
      'Our database of processors will help you choose the best CPU for your computer.',
  },
  {
    tags: [ListCpusContentTag.SortedBestValue, ListCpusContentTag.OrderedAsc],
    deps: ['company'],
    hook: (props: ContentFunctionParams) =>
      `The worst ${props.company || ''} CPUs by value. ` +
      'Our database of processors will help you choose the best CPU for your computer.',
  },
  {
    tags: [
      ListCpusContentTag.SortedReleaseDate,
      ListCpusContentTag.OrderedDesc,
    ],
    hook: (props: ContentFunctionParams) =>
      `The newest ${props.company || ''} CPUs by performance. ` +
      'Our database of processors will help you choose the best CPU for your computer.',
  },
  {
    tags: [ListCpusContentTag.SortedReleaseDate, ListCpusContentTag.OrderedAsc],
    hook: (props: ContentFunctionParams) =>
      `The oldest ${props.company || ''} CPUs by performance. ` +
      'Our database of processors will help you choose the best CPU for your computer.',
  },
);

export const buildPageDescription = (query: ListCpusQuery) => {
  const contentTags = buildListContentTags(query);
  const contentParams = buildListContentParams(query);

  return pageDescription({ tags: contentTags, params: contentParams });
};
