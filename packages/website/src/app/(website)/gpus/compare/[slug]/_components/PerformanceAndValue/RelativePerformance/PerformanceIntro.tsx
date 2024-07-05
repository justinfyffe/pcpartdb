'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getProductBenchmarkName,
  ProductType,
} from '@pcpartdb/shared';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { useGameSelection } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import { PreferredBenchmarkDialogTrigger } from 'packages/website/src/app/_common/product/components/PreferredBenchmarkDialog/PreferredBenchmarkDialog';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import React from 'react';

export const PerformanceIntroSentence1 = compileContentComponent({
  Component: (props) => (
    <>
      The average score in the{' '}
      <PreferredBenchmarkDialogTrigger
        buttonVariant={ButtonVariant.LinkDialog}
        productType={ProductType.Gpu}
        softReload
        productIds={props.productIds}
        gameSlug={props.gameSlug}
      >
        {props.preferredBenchmarkName}
      </PreferredBenchmarkDialogTrigger>{' '}
      benchmark test can be compared to similar GPUs to assess relative
      performance. Generally, powerful GPUs tend to have higher scores.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const { selectedGame } = useGameSelection();
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const [gpu1, gpu2] = comparison;

  const gpuName1 = formatProductName(gpu1, { company: false });
  const gpuName2 = formatProductName(gpu2, { company: false });

  const preferredBenchmarkName = getProductBenchmarkName(preferredBenchmark);

  return (
    <ContentProvider
      params={{
        gpuName1,
        gpuName2,
        preferredBenchmarkName,
        productIds: [gpu1.id, gpu2.id],
        gameSlug: selectedGame?.slug,
      }}
    >
      <p>
        <PerformanceIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
