'use client';

import { Product } from '@pcpartdb/shared';
import Markdown from 'markdown-to-jsx';
import React, { useMemo } from 'react';
import { ContentParams } from '../../../content/types';
import { useProductContent } from '../../content/useProductContent';

interface CustomSummaryProps {
  product: Product;
}

export const CustomSummary = (props: CustomSummaryProps) => {
  const { product } = props;
  const { contentParams } = useProductContent();

  const rawSummary = product?.summary;

  // Replace variables denoted as "{{variableName}}"
  const summary = useMemo(
    () =>
      rawSummary ? populateSummaryVariables(rawSummary, contentParams) : null,
    [contentParams, rawSummary],
  );

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
