'use client';

import {
  getProductBenchmarkName,
  HomeViewModel,
  ProductType,
} from '@pcpartdb/shared';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { PreferredBenchmarkDialogTrigger } from 'packages/website/src/app/_common/product/components/PreferredBenchmarkDialog/PreferredBenchmarkDialog';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import React, { useMemo } from 'react';
import { ListType, usePageContext } from '../../PageProvider';

interface ProductListSubtitleProps {
  productType: ProductType;
}

export function ProductListSubtitle(props: ProductListSubtitleProps) {
  const { productType } = props;
  const { refresh } = useViewModelContext<HomeViewModel>();
  const { cpuListType, gpuListType } = usePageContext();
  const preferredBenchmark = usePreferredBenchmark(productType);

  const listTypeLabel = useMemo(() => {
    if (
      (productType === ProductType.Cpu &&
        cpuListType === ListType.Performance) ||
      (productType === ProductType.Gpu && gpuListType === ListType.Performance)
    ) {
      return 'performance';
    } else if (
      (productType === ProductType.Cpu &&
        cpuListType === ListType.PerformancePerMsrp) ||
      (productType === ProductType.Gpu &&
        gpuListType === ListType.PerformancePerMsrp)
    ) {
      return 'performance per dollar';
    } else {
      return null;
    }
  }, [cpuListType, gpuListType, productType]);

  return (
    <h3 className="flex-1 text-base font-normal mb-0">
      Based on{' '}
      <PreferredBenchmarkDialogTrigger
        buttonVariant={ButtonVariant.LinkDialog}
        productType={productType}
        softReload
        onChange={refresh}
      >
        {getProductBenchmarkName(preferredBenchmark)}
      </PreferredBenchmarkDialogTrigger>{' '}
      {listTypeLabel}.
    </h3>
  );
}
