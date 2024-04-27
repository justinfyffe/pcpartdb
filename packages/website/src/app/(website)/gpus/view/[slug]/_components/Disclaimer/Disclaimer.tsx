'use client';

import { ProductType } from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useGameSelection } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
import React, { useCallback } from 'react';
import { usePageContext } from '../../PageProvider';

const RatingDisclaimer = compileContentComponent({
  tags: [],
  component: (props) => (
    <>
      *The {props.chipsetName}&apos;s performance score, performance per dollar,
      and rankings are based on the {props.preferredBenchmarkName} benchmark and
      MSRP.
    </>
  ),
});

export const Disclaimer = () => {
  const { selectedGame } = useGameSelection();
  const { viewModel } = usePageContext();

  const handleBenchmarkChange = useCallback(async () => {
    window.scrollTo(0, 0);
  }, []);

  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    softReload: true,
    productIds: [viewModel.gpu.id],
    gameSlug: selectedGame?.slug,
    onChange: handleBenchmarkChange,
  });

  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <RatingDisclaimer />{' '}
        <Button
          variant={ButtonVariant.Link}
          onClick={showPreferredBenchmarkDialog}
        >
          Click here to change your preferred benchmark.
        </Button>
      </p>
    </ContentProvider>
  );
};
