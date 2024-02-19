import React from 'react';
import {
  CompiledContentComponentVariants,
  ContentComponentParams,
  ContentTags,
} from '../types';
import { hasRequiredParams } from './hasRequiredParams';
import { hasRequiredTags } from './hasRequiredTags';

interface ProcessContentComponentOptions {
  variants: CompiledContentComponentVariants;
  tags?: ContentTags;
  params?: ContentComponentParams;
  required?: boolean;
}

export function processContentComponent(
  options: ProcessContentComponentOptions,
) {
  const { variants, tags: filters, params, required } = options;

  for (let i = 0; i < variants.length; ++i) {
    const content = variants[i];
    if (!hasRequiredTags(content, filters)) {
      continue;
    }

    if (!hasRequiredParams(content, params)) {
      continue;
    }

    return content.component(params);
  }

  if (!required) {
    return <></>;
  }

  throw new Error(
    'Cannot find content variant, but one is required. Check filters and parameters.',
  );
}
