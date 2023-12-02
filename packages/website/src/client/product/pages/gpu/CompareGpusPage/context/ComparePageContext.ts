import { CompareGpusViewModel } from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { createContext } from 'react';
import { buildContentParams } from '../../../../content/params';
import { buildContentTags } from '../../../../content/tags';

export interface ComparePageContextProps extends Partial<CompareGpusViewModel> {
  contentTags1: ContentTags;
  contentParams1: ContentParams;
  contentTags2: ContentTags;
  contentParams2: ContentParams;
}

export const ComparePageContext = createContext<ComparePageContextProps>({
  contentTags1: null,
  contentParams1: null,
  contentTags2: null,
  contentParams2: null,
});

export function createComparePageContext(viewModel: CompareGpusViewModel) {
  return {
    ...viewModel,
    contentTags1: buildContentTags(viewModel.comparison[0]),
    contentParams1: buildContentParams(
      viewModel.comparison[0],
      viewModel.contentData,
    ),
    contentTags2: buildContentTags(viewModel.comparison[1]),
    contentParams2: buildContentParams(
      viewModel.comparison[1],
      viewModel.contentData,
    ),
  } as ComparePageContextProps;
}
