'use client';

import { ProductType } from '@pcpartdb/shared';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useGameSelection } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import { PreferredBenchmarkDialogTrigger } from 'packages/website/src/app/_common/product/components/PreferredBenchmarkDialog/PreferredBenchmarkDialog';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';
import { usePageContext } from '../../../PageProvider';

const ValueIntroSentence1 = compileContentComponent({
  Component: (props) => (
    <>
      {props.nameWithNoCompany}&apos;s average performance per dollar in the{' '}
      <PreferredBenchmarkDialogTrigger
        buttonVariant={ButtonVariant.LinkDialog}
        productType={ProductType.Gpu}
        softReload
        productIds={props.productIds}
        gameSlug={props.gameSlug}
      >
        {props.preferredBenchmarkName}
      </PreferredBenchmarkDialogTrigger>{' '}
      benchmark can be compared to similar GPUs to assess relative value. A
      higher score generally implies better value for your money.
    </>
  ),
});

export const BenchmarkValueIntro = () => {
  const { contentTags, contentParams } = useProductContent();
  const { viewModel } = usePageContext();
  const { selectedGame } = useGameSelection();

  return (
    <ContentProvider
      tags={contentTags}
      params={{
        ...contentParams,
        productIds: [viewModel.gpu.id],
        gameSlug: selectedGame?.slug,
      }}
    >
      <p>
        <ValueIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
