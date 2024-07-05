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
import React, { useCallback } from 'react';

const RatingDisclaimer = compileContentComponent({
  tags: [],
  Component: (props) => (
    <>
      * Performance rating, performance per dollar, and rankings are based on
      the {props.preferredBenchmarkName} benchmark and MSRP.
    </>
  ),
});

export const Disclaimer = () => {
  const { selectedGame } = useGameSelection();
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);

  const handleBenchmarkChange = useCallback(async () => {
    window.scrollTo(0, 0);
  }, []);

  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;

  const gpuName1 = formatProductName(gpu1);
  const gpuName2 = formatProductName(gpu2);
  const preferredBenchmarkName = getProductBenchmarkName(preferredBenchmark);

  return (
    <ContentProvider
      params={{
        gpuName1,
        gpuName2,
        preferredBenchmarkName,
      }}
    >
      <p>
        <RatingDisclaimer />{' '}
        <PreferredBenchmarkDialogTrigger
          buttonVariant={ButtonVariant.LinkDialog}
          productType={ProductType.Gpu}
          softReload
          productIds={[gpu1.id, gpu2.id]}
          gameSlug={selectedGame?.slug}
          onChange={handleBenchmarkChange}
          className="text-left"
        >
          Click here to change your preferred benchmark.
        </PreferredBenchmarkDialogTrigger>
      </p>
    </ContentProvider>
  );
};
