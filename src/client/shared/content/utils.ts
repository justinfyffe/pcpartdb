import {
  CompiledContent,
  ContentKeys,
  ContentParams,
  ContentVariant,
  RawContent,
  RawContentVariant,
} from './types';

interface ProcessContentOptions {
  content: CompiledContent;
  keys?: ContentKeys;
  params?: ContentParams;
}

export function processContent(options: ProcessContentOptions) {
  const { content, keys, params } = options;

  const variants = getVariantsByKeys(content, keys);
  if (variants == null || variants.length === 0) {
    const tagsKey = generateContentKey(keys);
    throw new Error(
      `Cannot find content variant for tags=${tagsKey}. A fallback variant is missing.`,
    );
  }

  const variant = getVariantByParams(variants, params);

  if (variant == null) {
    throw new Error(
      'Cannot find content variant. Usually this means some required parameters are missing.',
    );
  }

  return variant.component(params);
}

function getVariantsByKeys(content: CompiledContent, keys?: ContentKeys) {
  const key = generateContentKey(keys ?? []);

  const variants = content[key];
  const fallbackVariants = content[''];
  return variants || fallbackVariants || null;
}

function getVariantByParams(
  variants: ContentVariant[],
  params?: ContentParams,
) {
  const paramsToFind = new Set(Object.keys(params ?? {}));

  for (let i = 0; i < variants.length; ++i) {
    const variant = variants[i];
    const { deps } = variant;

    if (deps.every((param) => paramsToFind.has(param))) {
      return variant;
    }
  }

  return null;
}

function generateContentKey(keys: ContentKeys = []) {
  const sorted = Array.isArray(keys)
    ? [...keys].sort()
    : [...Object.keys(keys).filter((key) => keys[key] === true)].sort();
  return sorted.join(',');
}

// TODO: return react component?
export function compileContent(...content: RawContent[]) {
  const compiled: CompiledContent = {};

  for (let i = 0; i < content.length; ++i) {
    const { key: rawKey, variants: rawVariants } = content[i];

    const key = generateContentKey(rawKey);
    const variants = Array.isArray(rawVariants) ? rawVariants : [rawVariants];

    compiled[key] = compileContentVariants(...variants);
  }

  return compiled;
}

function compileContentVariants(...variants: RawContentVariant[]) {
  return variants.map((variant) => ({
    deps: variant.deps ?? [],
    component: variant.component,
  }));
}
