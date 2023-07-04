import {
  compileContentFunction,
  ContentFunctionParams,
} from 'packages/website/src/client/shared/content';
import { useMemo } from 'react';
import { ListCpusContentTag } from '../content';
import { ListPageContextProps } from '../context';

const seoDescription = compileContentFunction(
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
    deps: [],
    hook: (props: ContentFunctionParams) =>
      `The best ${props.company || ''} CPUs by value. ` +
      'Our database of processors will help you choose the best CPU for your computer.',
  },
  {
    tags: [ListCpusContentTag.SortedBestValue, ListCpusContentTag.OrderedAsc],
    deps: [],
    hook: (props: ContentFunctionParams) =>
      `The worst ${props.company || ''} CPUs by value. ` +
      'Our database of processors will help you choose the best CPU for your computer.',
  },
  {
    tags: [ListCpusContentTag.SortedBestValue, ListCpusContentTag.OrderedAsc],
    deps: [],
    hook: (props: ContentFunctionParams) =>
      `The worst ${props.company || ''} CPUs by value. ` +
      'Our database of processors will help you choose the best CPU for your computer.',
  },
  {
    tags: [ListCpusContentTag.SortedReleaseDate, ListCpusContentTag.OrderedAsc],
    deps: [],
    hook: (props: ContentFunctionParams) =>
      `The newest ${props.company || ''} CPUs by value. ` +
      'Our database of processors will help you choose the best CPU for your computer.',
  },
  {
    tags: [ListCpusContentTag.SortedReleaseDate, ListCpusContentTag.OrderedAsc],
    deps: [],
    hook: (props: ContentFunctionParams) =>
      `The oldest ${props.company || ''} CPUs by value. ` +
      'Our database of processors will help you choose the best CPU for your computer.',
  },
);

export const useSeoDescription = (context: ListPageContextProps) => {
  const { contentParams: params, contentTags: tags } = context;

  return useMemo(() => {
    return seoDescription({ tags, params: params as ContentFunctionParams });
  }, [tags, params]);
};
