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

const PerformanceIntroSentence1 = compileContentComponent({
  Component: (props) => (
    <>
      {props.nameWithNoCompany}&apos;s average score for the{' '}
      <Button
        variant={ButtonVariant.Link}
        onClick={props.handleBenchmarkClick}
        className="underline decoration-dotted decoration-1"
      >
        {props.preferredBenchmarkName}
      </Button>{' '}
      benchmark can be compared to similar GPUs to assess relative performance.
      Generally, more powerful GPUs tend to have higher scores.
    </>
  ),
});

export const BenchmarkPerformanceIntro = () => {
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
      <p>
        <PerformanceIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
