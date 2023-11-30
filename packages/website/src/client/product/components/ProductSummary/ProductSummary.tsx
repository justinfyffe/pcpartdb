import {
  CpuAdditionalData,
  GpuAdditionalData,
  isCpuProduct,
  isGpuChipset,
  isGpuRetaillModel,
  Product,
  ProductAdditionalData,
} from '@pcpartdb/shared';
import Markdown from 'markdown-to-jsx';
import React, { useMemo } from 'react';
import { CpuSummary } from './cpu/CpuSummary';
import { GpuChipsetSummary } from './gpu-chipset/GpuChipsetSummary';
import { GpuRetailModelSummary } from './gpu-retail-model/GpuRetailModelSummary';
import { populateSummaryVariables } from './variables';

interface ProductSummaryProps {
  product: Product;
  additionalData: ProductAdditionalData;
}

export const ProductSummary = (props: ProductSummaryProps) => {
  const { product, additionalData } = props;

  const rawSummary = product?.summary;

  // Replace variables denoted as "{{variable_name}}"
  const summary = useMemo(
    () =>
      rawSummary
        ? populateSummaryVariables(rawSummary, product, additionalData)
        : null,
    [product, rawSummary, additionalData],
  );

  if (!summary) {
    if (isGpuChipset(product)) {
      return (
        <GpuChipsetSummary
          gpu={product}
          additionalData={additionalData as GpuAdditionalData}
        />
      );
    } else if (isGpuRetaillModel(product)) {
      return (
        <GpuRetailModelSummary
          gpu={product}
          additionalData={additionalData as GpuAdditionalData}
        />
      );
    } else if (isCpuProduct(product)) {
      return (
        <CpuSummary
          cpu={product}
          additionalData={additionalData as CpuAdditionalData}
        />
      );
    }

    return <></>;
  }

  return <Markdown>{summary}</Markdown>;
};
