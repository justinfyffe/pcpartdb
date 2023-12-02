import {
  isCpuProduct,
  isGpuChipset,
  isGpuRetailModel,
  Product,
} from '@pcpartdb/shared';
import Markdown from 'markdown-to-jsx';
import React, { useMemo } from 'react';
import { ContentParams, ContentTags } from '../../../shared/content/types';
import { CpuSummary } from './cpu/CpuSummary';
import { GpuChipsetSummary } from './gpu-chipset/GpuChipsetSummary';
import { GpuRetailModelSummary } from './gpu-retail-model/GpuRetailModelSummary';

interface ProductSummaryProps {
  product: Product;
  tags: ContentTags;
  params: ContentParams;
}

export const ProductSummary = (props: ProductSummaryProps) => {
  const { product, tags, params } = props;

  const rawSummary = product?.summary;

  // Replace variables denoted as "{{variableName}}"
  const summary = useMemo(
    () => (rawSummary ? populateSummaryVariables(rawSummary, params) : null),
    [rawSummary, params],
  );

  if (!summary) {
    if (isGpuChipset(product)) {
      return <GpuChipsetSummary tags={tags} params={params} />;
    } else if (isGpuRetailModel(product)) {
      return <GpuRetailModelSummary tags={tags} params={params} />;
    } else if (isCpuProduct(product)) {
      return <CpuSummary tags={tags} params={params} />;
    }

    return <></>;
  }

  return <Markdown>{summary}</Markdown>;
};

function populateSummaryVariables(rawOverview: string, params: ContentParams) {
  let overview = rawOverview;

  const keys = Object.keys(params);
  for (const key of keys) {
    overview = overview.replaceAll(`{{${key}}}`, params[key]);
  }

  return overview;
}
