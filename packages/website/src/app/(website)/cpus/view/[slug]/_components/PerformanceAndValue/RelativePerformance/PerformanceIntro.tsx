'use client';

import { ProductType } from '@pcpartdb/shared';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { PreferredBenchmarkDialogTrigger } from 'packages/website/src/app/_common/product/components/PreferredBenchmarkDialog/PreferredBenchmarkDialog';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';
import { usePageContext } from '../../../PageProvider';

export const PerformanceIntroParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      {props.nameWithNoCompany}&apos;s average score in the{' '}
      <PreferredBenchmarkDialogTrigger
        buttonVariant={ButtonVariant.LinkDialog}
        productType={ProductType.Cpu}
        softReload
        productIds={props.productIds}
      >
        {props.preferredBenchmarkName}
      </PreferredBenchmarkDialogTrigger>{' '}
      benchmark can be compared to similar CPUs to assess relative performance.
      Generally, more powerful CPUs tend to have higher scores.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { contentTags, contentParams } = useProductContent();
  const { viewModel } = usePageContext();

  return (
    <ContentProvider
      tags={contentTags}
      params={{ ...contentParams, productIds: [viewModel.cpu.id] }}
    >
      <p>
        <PerformanceIntroParagraph />
      </p>
    </ContentProvider>
  );
};
