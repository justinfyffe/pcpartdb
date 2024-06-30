'use client';

import {
  CompareCpusViewModel,
  formatProductName,
  getProductBenchmarkShortName,
  ProductType,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
import React from 'react';

const ValueIntroParagraph = compileContentComponent({
  Component: (props) => (
    <>
      The average performance per dollar in the{' '}
      <Button
        variant={ButtonVariant.Link}
        onClick={props.handleBenchmarkClick}
        className="underline decoration-dotted decoration-1"
      >
        {props.preferredBenchmarkName}
      </Button>{' '}
      benchmark test can be compared to similar CPUs to assess relative value. A
      higher score implies a better value for your money.
    </>
  ),
});

export const ValueIntro = () => {
  const { comparison } = useViewModel<CompareCpusViewModel>();
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false });
  const name2 = formatProductName(cpu2, { company: false });
  const preferredBenchmarkName =
    getProductBenchmarkShortName(preferredBenchmark);

  const handleBenchmarkClick = usePreferredBenchmarkDialog({
    productType: ProductType.Cpu,
    softReload: true,
    productIds: [cpu1.id, cpu2.id],
  });

  return (
    <ContentProvider
      params={{ name1, name2, preferredBenchmarkName, handleBenchmarkClick }}
    >
      <p>
        <ValueIntroParagraph />
      </p>
    </ContentProvider>
  );
};
