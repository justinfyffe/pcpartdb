import {
  compileContentFunction,
  ContentFunctionParams,
} from 'packages/website/src/client/shared/content';
import { useMemo } from 'react';
import { ListGpusContentTag } from '../content';
import { ListPageContextProps } from '../context';

const seoTitle = compileContentFunction(
  {
    tags: [ListGpusContentTag.SortedBestPerformance],
    deps: [],
    hook: (props) =>
      `${props.bestOrWorstTitle} ${props.company || ''} ${
        props.marketSegment || ''
      } GPUs by performance`,
  },
  {
    tags: [ListGpusContentTag.SortedBestValue],
    deps: [],
    hook: (props) =>
      `${props.bestOrWorstTitle} ${props.company || ''} ${
        props.marketSegment || ''
      } GPUs by performance per dollar`,
  },
  {
    tags: [ListGpusContentTag.SortedReleaseDate],
    deps: [],
    hook: (props) =>
      `${props.newestOrOldestTitle} ${props.company || ''} ${
        props.marketSegment || ''
      } GPUs by release date`,
  },
);

export const useSeoTitle = (context: ListPageContextProps) => {
  const { contentParams: params, contentTags: tags } = context;

  return useMemo(() => {
    return seoTitle({ tags, params: params as ContentFunctionParams });
  }, [params, tags]);
};
