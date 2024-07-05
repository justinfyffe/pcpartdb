'use client';

import { ProductType } from '@pcpartdb/shared';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useGameSelection } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import { PreferredBenchmarkDialogTrigger } from 'packages/website/src/app/_common/product/components/PreferredBenchmarkDialog/PreferredBenchmarkDialog';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React, { useCallback } from 'react';
import { usePageContext } from '../../PageProvider';

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
  const { viewModel } = usePageContext();

  const handleBenchmarkChange = useCallback(async () => {
    window.scrollTo(0, 0);
  }, []);

  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p>
        <RatingDisclaimer />{' '}
        <PreferredBenchmarkDialogTrigger
          buttonVariant={ButtonVariant.LinkDialog}
          productType={ProductType.Gpu}
          softReload
          productIds={[viewModel.gpu.id]}
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
