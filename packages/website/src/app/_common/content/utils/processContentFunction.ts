import {
  CompiledContentFunctionVariants,
  ContentFunctionParams,
  ContentTags,
} from '../types';
import { hasRequiredParams } from './hasRequiredParams';
import { hasRequiredTags } from './hasRequiredTags';

interface ProcessContentFunctionOptions {
  variants: CompiledContentFunctionVariants;
  tags?: ContentTags;
  params?: ContentFunctionParams;
  required?: boolean;
}

export function processContentFunction(options: ProcessContentFunctionOptions) {
  const { variants, tags, params, required } = options;

  for (let i = 0; i < variants.length; ++i) {
    const content = variants[i];
    if (!hasRequiredTags(content, tags)) {
      continue;
    }

    if (!hasRequiredParams(content, params)) {
      continue;
    }

    return content.hook(params);
  }

  if (!required) {
    return '';
  }

  throw new Error(
    'Cannot find content variant, but one is required. Check filters and parameters.',
  );
}
