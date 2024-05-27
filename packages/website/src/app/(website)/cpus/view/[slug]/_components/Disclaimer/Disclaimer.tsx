'use client';

import { ProductType, ViewCpuViewModel } from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
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
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Cpu,
    softReload: true,
    productIds: [viewModel.cpu.id],
    onChange: handleBenchmarkChange,
  });

  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p>
        <RatingDisclaimer />{' '}
        <Button
          variant={ButtonVariant.Link}
          onClick={showPreferredBenchmarkDialog}
          className="text-left"
        >
          Click here to change your preferred benchmark.
        </Button>
      </p>
    </ContentProvider>
  );
};
