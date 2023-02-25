import React from 'react';
import { Content } from './content';
import {
  CompiledContent,
  CompiledContentVariant,
  ContentFilters,
  ContentParams,
  RawContent,
} from './content-types';

interface ProcessContentOptions {
  compiledContent: CompiledContent;
  filters?: ContentFilters;
  params?: ContentParams;
  required?: boolean;
}

export function processContent(options: ProcessContentOptions) {
  const { compiledContent, filters, params, required } = options;

  for (let i = 0; i < compiledContent.length; ++i) {
    const content = compiledContent[i];
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

function hasRequiredFilters(
  content: CompiledContentVariant,
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
  content: CompiledContentVariant,
  params?: ContentParams,
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

export function compileContent(...content: RawContent[]) {
  const compiled: CompiledContent = [];

  for (let i = 0; i < content.length; ++i) {
    const { filters, deps, component } = content[i];

    compiled.push({
      filters: filters || [],
      deps: deps || [],
      component,
    });
  }

  // eslint-disable-next-line react/display-name
  return (props: {
    filters?: ContentFilters;
    params?: ContentParams;
    required?: boolean;
  }) => <Content compiledContent={compiled} {...props} />;
}
