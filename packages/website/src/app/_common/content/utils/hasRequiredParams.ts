import {
  CompiledContentComponentVariant,
  CompiledContentFunctionVariant,
  ContentComponentParams,
  ContentFunctionParams,
} from '../types';

export function hasRequiredParams(
  content: CompiledContentComponentVariant | CompiledContentFunctionVariant,
  params?: ContentComponentParams | ContentFunctionParams,
) {
  if (content.deps == null || content.deps.length === 0) {
    return true;
  }

  if (params == null) {
    return false;
  }

  const paramsToFind = new Set(Object.keys(params ?? {}));
  return content.deps.every(
    (param) => paramsToFind.has(param) && params[param] != null,
  );
}
