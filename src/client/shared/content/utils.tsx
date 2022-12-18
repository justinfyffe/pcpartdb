import React from 'react';
import { Content } from './component';
import {
  CompiledContent,
  CompiledContentVariant,
  ContentHints,
  ContentParams,
  RawContent,
} from './types';

interface ProcessContentOptions {
  content: CompiledContent;
  hints?: ContentHints;
  params?: ContentParams;
}

export function processContent(options: ProcessContentOptions) {
  const { content, hints, params } = options;

  const variants = getVariantsByHints(content, hints);
  if (variants == null || variants.length === 0) {
    const tagsKey = generateContentKey(hints);
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

function getVariantsByHints(content: CompiledContent, keys?: ContentHints) {
  const key = generateContentKey(keys ?? []);

  const variants = content[key];
  const fallbackVariants = content[''];
  return variants || fallbackVariants || null;
}

function getVariantByParams(
  variants: CompiledContentVariant[],
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

function generateContentKey(keys: ContentHints = []) {
  const sorted = Array.isArray(keys)
    ? [...keys].sort()
    : [...Object.keys(keys).filter((key) => keys[key] === true)].sort();
  return sorted.join(',');
}

export function compileContent(...content: RawContent[]) {
  const compiled: CompiledContent = {};

  for (let i = 0; i < content.length; ++i) {
    const { hints, deps, component } = content[i];

    const key = generateContentKey(hints);
    compiled[key] = compiled[key] || [];
    compiled[key].push({ deps, component });
  }

  Object.keys(compiled).forEach((key) => {
    compiled[key].sort(
      (v1, v2) => (v2.deps?.length ?? 0) - (v1.deps?.length ?? 0),
    );
  });

  // eslint-disable-next-line react/display-name
  return (props: { hints?: ContentHints; params?: ContentParams }) => (
    <Content content={compiled} {...props} />
  );
}
