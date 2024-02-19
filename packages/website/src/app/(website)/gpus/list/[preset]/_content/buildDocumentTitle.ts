import { ListGpusQuery, WEBSITE_NAME } from '@pcpartdb/shared';
import { compileContentFunction } from 'packages/website/src/app/_common/content/utils/compileContentFunction';
import { buildListContentParams } from './buildListContentParams';
import {
  buildListContentTags,
  ListGpusContentTag,
} from './buildListContentTags';

const documentTitle = compileContentFunction(
  {
    tags: [ListGpusContentTag.SortedBestPerformance],
    deps: [],
    hook: (props) =>
      `${props.bestOrWorstTitle} ${props.marketSegment || ''} ${
        props.company || ''
      }  GPUs by performance`,
  },
  {
    tags: [ListGpusContentTag.SortedBestValue],
    deps: [],
    hook: (props) =>
      `${props.bestOrWorstTitle} ${props.marketSegment || ''} ${
        props.company || ''
      }  GPUs by performance per dollar`,
  },
  {
    tags: [ListGpusContentTag.SortedReleaseDate],
    deps: [],
    hook: (props) =>
      `${props.newestOrOldestTitle} ${props.marketSegment || ''} ${
        props.company || ''
      }  GPUs by release date`,
  },
);

export const buildDocumentTitle = (query: ListGpusQuery) => {
  const contentTags = buildListContentTags(query);
  const contentParams = buildListContentParams(query);

  return `${documentTitle({
    tags: contentTags,
    params: contentParams,
  })} - ${WEBSITE_NAME}`;
};
