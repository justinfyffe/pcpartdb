import { CompareCpusViewModel, ProductType } from '@pcpartdb/shared';
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

export interface ComparePageContextState extends Partial<CompareCpusViewModel> {
  contentTags1: ContentTags;
  contentParams1: ContentParams;
  contentTags2: ContentTags;
  contentParams2: ContentParams;
  updateViewModel: (viewModel: CompareCpusViewModel) => void;
}

export const ComparePageContext = createContext<ComparePageContextState>({
  contentTags1: null,
  contentParams1: null,
  contentTags2: null,
  contentParams2: null,
  updateViewModel: null,
});

interface ComparePageContextProviderProps {
  viewModel: CompareCpusViewModel;
  children?: React.ReactNode;
}

export const ComparePageContextProvider: FunctionComponent<
  ComparePageContextProviderProps
> = (props) => {
  const { children } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);

  const [viewModel, setViewModel] = useState(props.viewModel);

  const context = useMemo(() => {
    return {
      ...viewModel,
      contentTags1: buildContentTags({
        product: viewModel.comparison[0],
        preferredBenchmark,
      }),
      contentParams1: buildContentParams({
        product: viewModel.comparison[0],
        contentData: viewModel.contentData,
        preferredBenchmark,
      }),
      contentTags2: buildContentTags({
        product: viewModel.comparison[1],
        preferredBenchmark,
      }),
      contentParams2: buildContentParams({
        product: viewModel.comparison[1],
        contentData: viewModel.contentData,
        preferredBenchmark,
      }),
      updateViewModel: setViewModel,
    } as ComparePageContextState;
  }, [preferredBenchmark, viewModel]);

  return (
    <ComparePageContext.Provider value={context}>
      {children}
    </ComparePageContext.Provider>
  );
};
