'use client';

import { ProductType } from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useGameSelection } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
import React from 'react';
import { usePageContext } from '../../../PageProvider';

const ValueIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.nameWithNoCompany}&apos;s value with similar{' '}
      {props.marketSegment} GPUs. This provides insight into which GPU gives the
      best bang for your buck. This data is based on its{' '}
      <Button variant={ButtonVariant.Link} onClick={props.handleBenchmarkClick}>
        {props.preferredBenchmarkName}
      </Button>{' '}
      performance and MSRP.
    </>
  ),
});

export const BenchmarkValueIntro = () => {
  const { contentTags, contentParams } = useProductContent();
  const { viewModel } = usePageContext();
  const { selectedGame } = useGameSelection();

  const handleBenchmarkClick = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    softReload: true,
    productIds: [viewModel.gpu.id],
    gameSlug: selectedGame?.slug,
  });

  return (
    <ContentProvider
      tags={contentTags}
      params={{ ...contentParams, handleBenchmarkClick }}
    >
      <p className="text-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
