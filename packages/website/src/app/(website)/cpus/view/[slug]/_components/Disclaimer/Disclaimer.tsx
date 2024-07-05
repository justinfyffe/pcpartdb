'use client';

import { ProductType, ViewCpuViewModel } from '@pcpartdb/shared';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { PreferredBenchmarkDialogTrigger } from 'packages/website/src/app/_common/product/components/PreferredBenchmarkDialog/PreferredBenchmarkDialog';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React, { useCallback } from 'react';

const RatingDisclaimer = compileContentComponent({
  Component: (props) => (
    <>
      * Performance rating, performance per dollar, and rankings are based on
      the {props.preferredBenchmarkName} benchmark and MSRP.
    </>
  ),
});

export const Disclaimer = () => {
  const { viewModel } = useViewModelContext<ViewCpuViewModel>();

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
          productType={ProductType.Cpu}
          softReload
          productIds={[viewModel.cpu.id]}
          onChange={handleBenchmarkChange}
          className="text-left"
        >
          Click here to change your preferred benchmark.
        </PreferredBenchmarkDialogTrigger>
      </p>
    </ContentProvider>
  );
};
