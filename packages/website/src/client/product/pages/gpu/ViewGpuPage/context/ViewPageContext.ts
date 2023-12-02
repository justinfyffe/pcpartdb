import { ViewGpuViewModel } from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { createContext } from 'react';
import { buildContentParams } from '../../../../content/params';
import { buildContentTags } from '../../../../content/tags';

export interface ViewPageContextProps extends Partial<ViewGpuViewModel> {
  contentTags: ContentTags;
  contentParams: ContentParams;
}

export const ViewPageContext = createContext<ViewPageContextProps>({
  contentTags: null,
  contentParams: null,
});

export function createViewPageContext(viewModel: ViewGpuViewModel) {
  return {
    ...viewModel,
    contentTags: buildContentTags(viewModel.gpu),
    contentParams: buildContentParams(viewModel.gpu, viewModel.contentData),
  } as ViewPageContextProps;
}
