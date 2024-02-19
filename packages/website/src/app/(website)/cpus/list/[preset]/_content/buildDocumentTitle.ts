import { ListCpusQuery, WEBSITE_NAME } from '@pcpartdb/shared';
import { compileContentFunction } from 'packages/website/src/app/_common/content/utils/compileContentFunction';
import { buildListContentParams } from './buildListContentParams';
import {
  buildListContentTags,
  ListCpusContentTag,
} from './buildListContentTags';

const documentTitle = compileContentFunction(
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

export const buildDocumentTitle = (query: ListCpusQuery) => {
  const contentTags = buildListContentTags(query);
  const contentParams = buildListContentParams(query);

  return `${documentTitle({
    tags: contentTags,
    params: contentParams,
  })} - ${WEBSITE_NAME}`;
};
