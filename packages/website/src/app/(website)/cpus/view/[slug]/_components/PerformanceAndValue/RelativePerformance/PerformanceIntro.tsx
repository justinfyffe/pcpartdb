'use client';

import { ProductType } from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
import React from 'react';
import { usePageContext } from '../../../PageProvider';

export const PerformanceIntroParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      {props.nameWithNoCompany}&apos;s average score in the{' '}
      <Button
        variant={ButtonVariant.Link}
        onClick={props.handleBenchmarkClick}
        className="underline decoration-dotted decoration-1"
      >
        {props.preferredBenchmarkName}
      </Button>{' '}
      benchmark can be compared to similar CPUs to assess relative performance.
      Generally, more powerful CPUs tend to have higher scores.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { contentTags, contentParams } = useProductContent();
  const { viewModel } = usePageContext();

  const handleBenchmarkClick = usePreferredBenchmarkDialog({
    productType: ProductType.Cpu,
    softReload: true,
    productIds: [viewModel.cpu.id],
  });

  return (
    <ContentProvider
      tags={contentTags}
      params={{ ...contentParams, handleBenchmarkClick }}
    >
      <p>
        <PerformanceIntroParagraph />
      </p>
    </ContentProvider>
  );
};
