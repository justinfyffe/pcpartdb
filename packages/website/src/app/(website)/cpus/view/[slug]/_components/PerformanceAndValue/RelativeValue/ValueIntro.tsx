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

const ValueIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      Compare {props.nameWithNoCompany}&apos;s value with similar{' '}
      {props.marketSegment} CPUs. This provides insight into which CPUs gives
      the best bang for your buck. This data is based on its{' '}
      <Button variant={ButtonVariant.Link} onClick={props.handleBenchmarkClick}>
        {props.preferredBenchmarkName}
      </Button>{' '}
      performance and MSRP.
    </>
  ),
});

export const ValueIntro = () => {
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
      <p className="text-dimmed">
        <ValueIntroParagraph />
      </p>
    </ContentProvider>
  );
};
