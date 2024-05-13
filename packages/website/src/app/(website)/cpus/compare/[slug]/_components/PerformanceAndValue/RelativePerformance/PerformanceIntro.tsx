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

export const PerformanceIntroParagraph = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.name1} and {props.name2}&apos;s performance with similar
      CPUs. This provides insight into how their benchmarks compare to their
      peers. This data is based on its{' '}
      <Button variant={ButtonVariant.Link} onClick={props.handleBenchmarkClick}>
        {props.preferredBenchmarkName}
      </Button>{' '}
      performance.
    </>
  ),
});

export const PerformanceIntro = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const { comparison } = useViewModel<CompareCpusViewModel>();
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
      <p className="text-dimmed">
        <PerformanceIntroParagraph />
      </p>
    </ContentProvider>
  );
};
