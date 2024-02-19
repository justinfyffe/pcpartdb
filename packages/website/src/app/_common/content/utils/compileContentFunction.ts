import {
  CompiledContentFunctionVariants,
  ContentFunction,
  ContentFunctionParams,
  ContentTags,
  RawContentFunction,
} from '../types';
import { processContentFunction } from './processContentFunction';

export function compileContentFunction(
  ...content: RawContentFunction[]
): ContentFunction {
  const variants: CompiledContentFunctionVariants = [];

  for (let i = 0; i < content.length; ++i) {
    const { tags, deps, hook } = content[i];

    variants.push({
      tags: tags || [],
      deps: deps || [],
      hook,
    });
  }

  return (props?: {
    tags?: ContentTags;
    params?: ContentFunctionParams;
    required?: boolean;
  }) => processContentFunction({ variants, ...(props ?? {}) });
}
