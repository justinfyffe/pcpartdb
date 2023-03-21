import React from 'react';
import { Content } from './Content';
import {
  CompiledContentComponentVariant,
  CompiledContentComponentVariants,
  CompiledContentFunctionVariant,
  CompiledContentFunctionVariants,
  ContentComponentParams,
  ContentFilters,
  ContentFunction,
  ContentFunctionParams,
  RawContentComponent,
  RawContentFunction,
} from './content-types';

interface ProcessContentComponentOptions {
  variants: CompiledContentComponentVariants;
  filters?: ContentFilters;
  params?: ContentComponentParams;
  required?: boolean;
}

interface ProcessContentFunctionOptions {
  variants: CompiledContentFunctionVariants;
  filters?: ContentFilters;
  params?: ContentFunctionParams;
  required?: boolean;
}

export function processContentComponent(
  options: ProcessContentComponentOptions,
) {
  const { variants, filters, params, required } = options;

  for (let i = 0; i < variants.length; ++i) {
    const content = variants[i];
    if (!hasRequiredFilters(content, filters)) {
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
  const { variants, filters, params, required } = options;

  for (let i = 0; i < variants.length; ++i) {
    const content = variants[i];
    if (!hasRequiredFilters(content, filters)) {
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

function hasRequiredFilters(
  content: CompiledContentComponentVariant | CompiledContentFunctionVariant,
  filters?: ContentFilters,
) {
  if (content.filters == null || content.filters.length === 0) {
    return true;
  }

  if (filters == null) {
    return false;
  }

  let filtersToCheck: Set<string>;
  if (Array.isArray(filters)) {
    filtersToCheck = new Set(filters || []);
  } else {
    const filtered: string[] = [];
    const keys = Object.keys(filters);
    for (const filter of keys) {
      if (filters[filter] === true) {
        filtered.push(filter);
      }
    }
    filtersToCheck = new Set(filtered);
  }

  return content.filters.every((hint) => filtersToCheck.has(hint));
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
    const { filters, deps, component } = content[i];

    variants.push({
      filters: filters || [],
      deps: deps || [],
      component,
    });
  }

  // eslint-disable-next-line react/display-name
  return (props: {
    filters?: ContentFilters;
    params?: ContentComponentParams;
    required?: boolean;
  }) => <Content variants={variants} {...props} />;
}

export function compileContentFunction(
  ...content: RawContentFunction[]
): ContentFunction {
  const variants: CompiledContentFunctionVariants = [];

  for (let i = 0; i < content.length; ++i) {
    const { filters, deps, hook } = content[i];

    variants.push({
      filters: filters || [],
      deps: deps || [],
      hook,
    });
  }

  return (props?) => {
    const filters = props.filters || [];
    const params = props.params || {};
    const required = props.required || false;

    return processContentFunction({ variants, filters, params, required });
  };
}
