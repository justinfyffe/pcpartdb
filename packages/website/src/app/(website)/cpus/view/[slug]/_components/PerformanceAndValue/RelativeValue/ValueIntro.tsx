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
  Component: (props) => (
    <>
      {props.nameWithNoCompany}&apos;s average performance per dollar for the{' '}
      <Button
        variant={ButtonVariant.Link}
        onClick={props.handleBenchmarkClick}
        className="underline decoration-dotted decoration-1"
      >
        {props.preferredBenchmarkName}
      </Button>{' '}
      benchmark can be compared to similar CPUs to assess relative value. A
      higher score generally implies better value for your moeny.
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
      <p>
        <ValueIntroParagraph />
      </p>
    </ContentProvider>
  );
};
