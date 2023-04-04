import React from 'react';
import { Content } from './Content';
import {
  CompiledContentComponentVariant,
  CompiledContentComponentVariants,
  CompiledContentFunctionVariant,
  CompiledContentFunctionVariants,
  ContentComponentParams,
  ContentFunction,
  ContentFunctionParams,
  ContentTags,
  RawContentComponent,
  RawContentFunction,
} from './types';

interface ProcessContentComponentOptions {
  variants: CompiledContentComponentVariants;
  tags?: ContentTags;
  params?: ContentComponentParams;
  required?: boolean;
}

interface ProcessContentFunctionOptions {
  variants: CompiledContentFunctionVariants;
  tags?: ContentTags;
  params?: ContentFunctionParams;
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

function hasRequiredTags(
  content: CompiledContentComponentVariant | CompiledContentFunctionVariant,
  tags?: ContentTags,
) {
  if (content.tags == null || content.tags.length === 0) {
    return true;
  }

  if (tags == null) {
    return false;
  }

  let tagsToCheck: Set<string>;
  if (Array.isArray(tags)) {
    tagsToCheck = new Set(tags || []);
  } else {
    const filtered: string[] = [];
    const keys = Object.keys(tags);
    for (const filter of keys) {
      if (tags[filter] === true) {
        filtered.push(filter);
      }
    }
    tagsToCheck = new Set(filtered);
  }

  return content.tags.every((hint) => tagsToCheck.has(hint));
}

function hasRequiredParams(
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

export function compileContentComponent(...content: RawContentComponent[]) {
  const variants: CompiledContentComponentVariants = [];

  for (let i = 0; i < content.length; ++i) {
    const { tags, deps, component } = content[i];

    variants.push({
      tags: tags || [],
      deps: deps || [],
      component,
    });
  }

  // eslint-disable-next-line react/display-name
  return (props: {
    tags?: ContentTags;
    params?: ContentComponentParams;
    required?: boolean;
  }) => <Content variants={variants} {...props} />;
}

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

  return (props?) => {
    const tags = props.tags || [];
    const params = props.params || {};
    const required = props.required || false;

    return processContentFunction({ variants, tags, params, required });
  };
}
