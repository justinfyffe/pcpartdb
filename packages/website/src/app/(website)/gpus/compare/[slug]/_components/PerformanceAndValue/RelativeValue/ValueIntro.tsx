'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getProductBenchmarkName,
  ProductType,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { useGameSelection } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
import React from 'react';

export const ValueIntroSentence1 = compileContentComponent({
  Component: (props) => (
    <>
      Compare the{' '}
      <Button
        variant={ButtonVariant.Link}
        onClick={props.handleBenchmarkClick}
        className="underline decoration-dotted decoration-1"
      >
        {props.preferredBenchmarkName}
      </Button>{' '}
      performance per dollar with similar GPUs. A higher score implies a better
      value for your money.
    </>
  ),
});

export const ValueIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const { selectedGame } = useGameSelection();
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const [gpu1, gpu2] = comparison;

  const gpuName1 = formatProductName(gpu1, { company: false });
  const gpuName2 = formatProductName(gpu2, { company: false });

  const preferredBenchmarkName = getProductBenchmarkName(preferredBenchmark);

  const handleBenchmarkClick = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    softReload: true,
    productIds: [gpu1.id, gpu2.id],
    gameSlug: selectedGame?.slug,
  });

  return (
    <ContentProvider
      params={{
        gpuName1,
        gpuName2,
        preferredBenchmarkName,
        handleBenchmarkClick,
      }}
    >
      <p>
        <ValueIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
