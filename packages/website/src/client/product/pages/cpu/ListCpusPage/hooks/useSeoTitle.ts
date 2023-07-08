import {
  compileContentFunction,
  ContentFunctionParams,
} from 'packages/website/src/client/shared/content';
import { useMemo } from 'react';
import { ListCpusContentTag } from '../content';
import { ListPageContextProps } from '../context';

const seoTitle = compileContentFunction(
  {
    tags: [ListCpusContentTag.SortedBestPerformance],
    deps: [],
    hook: (props) =>
      `${props.bestOrWorstTitle} ${props.marketSegment || ''} ${
        props.company || ''
      }  CPUs by performance`,
  },
  {
    tags: [ListCpusContentTag.SortedBestValue],
    deps: [],
    hook: (props) =>
      `${props.bestOrWorstTitle} ${props.marketSegment || ''} ${
        props.company || ''
      }  CPUs by performance per dollar`,
  },
  {
    tags: [ListCpusContentTag.SortedReleaseDate],
    deps: [],
    hook: (props) =>
      `${props.newestOrOldestTitle} ${props.marketSegment || ''} ${
        props.company || ''
      }  CPUs by release date`,
  },
);

export const useSeoTitle = (context: ListPageContextProps) => {
  const { contentParams: params, contentTags: tags } = context;

  return useMemo(() => {
    return seoTitle({ tags, params: params as ContentFunctionParams });
  }, [params, tags]);
};
