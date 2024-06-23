'use client';

import { HomeViewModel, ProductType } from '@pcpartdb/shared';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React, { useMemo } from 'react';
import { ListType, usePageContext } from '../../PageProvider';
import { ProductListItem } from './ProductListItem';

interface ProductListProps {
  productType: ProductType;
}

export function ProductList(props: ProductListProps) {
  const { productType } = props;
  const { gpuListType, cpuListType } = usePageContext();
  const { viewModel, loading } = useViewModelContext<HomeViewModel>();

  const list = useMemo(() => {
    if (
      productType === ProductType.Cpu &&
      cpuListType === ListType.Performance
    ) {
      return viewModel.cpuData.performanceList;
    } else if (
      productType === ProductType.Cpu &&
      cpuListType === ListType.PerformancePerMsrp
    ) {
      return viewModel.cpuData.valueList;
    } else if (
      productType === ProductType.Gpu &&
      gpuListType === ListType.Performance
    ) {
      return viewModel.gpuData.performanceList;
    } else if (
      productType === ProductType.Gpu &&
      gpuListType === ListType.PerformancePerMsrp
    ) {
      return viewModel.gpuData.valueList;
    } else {
      return [];
    }
  }, [
    cpuListType,
    gpuListType,
    productType,
    viewModel.cpuData.performanceList,
    viewModel.cpuData.valueList,
    viewModel.gpuData.performanceList,
    viewModel.gpuData.valueList,
  ]);

  return (
    <div className="flex flex-col gap-4 mb-2">
      {list.map((product, i) => (
        <ProductListItem
          key={product.id}
          product={product}
          productType={productType}
          rank={i + 1}
          loading={loading}
        />
      ))}
    </div>
  );
}
