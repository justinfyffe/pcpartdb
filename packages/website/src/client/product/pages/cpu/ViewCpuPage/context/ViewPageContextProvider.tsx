import { ProductType, ViewCpuViewModel } from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, {
  createContext,
  FunctionComponent,
  useMemo,
  useState,
} from 'react';
import { buildContentParams } from '../../../../content/params';
import { buildContentTags } from '../../../../content/tags';

export interface ViewPageContextState extends Partial<ViewCpuViewModel> {
  contentTags: ContentTags;
  contentParams: ContentParams;
  updateViewModel: (viewModel: ViewCpuViewModel) => void;
}

export const ViewPageContext = createContext<ViewPageContextState>({
  contentTags: null,
  contentParams: null,
  updateViewModel: null,
});

interface ViewPageContextProviderProps {
  viewModel: ViewCpuViewModel;
  children?: React.ReactNode;
}

export const ViewPageContextProvider: FunctionComponent<
  ViewPageContextProviderProps
> = (props) => {
  const { children } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);

  const [viewModel, setViewModel] = useState(props.viewModel);

  const context = useMemo(() => {
    return {
      ...viewModel,
      contentTags: buildContentTags({
        product: viewModel.cpu,
        preferredBenchmark,
      }),
      contentParams: buildContentParams({
        product: viewModel.cpu,
        contentData: viewModel.contentData,
        preferredBenchmark,
      }),
      updateViewModel: setViewModel,
    } as ViewPageContextState;
  }, [preferredBenchmark, viewModel]);

  return (
    <ViewPageContext.Provider value={context}>
      {children}
    </ViewPageContext.Provider>
  );
};
