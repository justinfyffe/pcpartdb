'use client';

import {
  CompareCpusViewModel,
  CompareGpusViewModel,
  CpuProduct,
  GpuProduct,
  ProductType,
  ViewCpuViewModel,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { useMemo } from 'react';
import { ViewModelType } from '../../contexts/types';
import { useViewModelContext } from '../../contexts/ViewModelProvider';
import { usePreferredBenchmark } from '../../user/usePreferredBenchmark';
import { buildProductContentParams } from './buildProductContentParams';
import { buildProductContentTags } from './buildProductContentTags';

export function useProductContent(productIndex?: number) {
  const { type, viewModel } = useViewModelContext();
  const productType = getProductTypeFromViewModelType(type);
  const product = getProductFromViewModel(type, viewModel, productIndex);
  const preferredBenchmark = usePreferredBenchmark(productType);

  const contentParams = useMemo(() => {
    return buildProductContentParams({
      product,
      preferredBenchmark,
      contentData: viewModel.contentData,
    });
  }, [preferredBenchmark, product, viewModel.contentData]);

  const contentTags = useMemo(() => {
    return buildProductContentTags({
      product,
      preferredBenchmark,
    });
  }, [preferredBenchmark, product]);

  return { contentTags, contentParams };
}

function getProductTypeFromViewModelType(type: ViewModelType) {
  if (
    type === ViewModelType.CompareCpusViewModel ||
    type === ViewModelType.ViewCpuViewModel
  ) {
    return ProductType.Cpu;
  } else if (
    type === ViewModelType.CompareGpusViewModel ||
    type === ViewModelType.ViewGpuViewModel
  ) {
    return ProductType.Gpu;
  } else {
    throw new Error(
      'Invalid view model type for getProductTypeFromViewModelType',
    );
  }
}

function getProductFromViewModel(
  type: ViewModelType,
  viewModel: unknown,
  productIndex?: number,
) {
  if (type === ViewModelType.CompareCpusViewModel) {
    const comparison = (viewModel as CompareCpusViewModel).comparison;
    return comparison[productIndex ?? 0] as CpuProduct;
  } else if (type === ViewModelType.CompareGpusViewModel) {
    const comparison = (viewModel as CompareGpusViewModel).comparison;
    return comparison[productIndex ?? 0] as GpuProduct;
  } else if (type === ViewModelType.ViewCpuViewModel) {
    const cpu = (viewModel as ViewCpuViewModel).cpu;
    return cpu as CpuProduct;
  } else if (type === ViewModelType.ViewGpuViewModel) {
    const gpu = (viewModel as ViewGpuViewModel).gpu;
    return gpu as GpuProduct;
  } else {
    throw new Error('Invalid view model type for getProductFromViewModel');
  }
}
