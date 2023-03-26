import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ContentContext } from './content-context';
import {
  CompiledContentComponentVariants,
  ContentComponentParams,
  ContentFilters,
  ContentHookFunction,
  ContentHookParams,
} from './content-types';
import { processContentComponent } from './content-utils';

export interface ContentComponentProps {
  variants: CompiledContentComponentVariants;

  filters?: ContentFilters;
  params?: ContentComponentParams;
  required?: boolean;
}

export interface ContentHookProps {
  hook: ContentHookFunction;

  filters?: ContentFilters;
  params?: ContentHookParams;
  required?: boolean;
}

export const Content: FunctionComponent<
  ContentComponentProps | ContentHookProps
> = (props) => {
  if ('hook' in props) {
    return <ContentHook {...props} />;
  } else {
    return <ContentComponent {...props} />;
  }
};

const ContentComponent: FunctionComponent<ContentComponentProps> = (props) => {
  const { variants } = props;

  const context = useContext(ContentContext);

  const filters = props.filters || context.filters;
  const params = props.params || context.params;
  const required = props.required || false;

  const component = useMemo(() => {
    return processContentComponent({
      variants,
      filters,
      params,
      required,
    });
  }, [filters, params, required, variants]);

  return <>{component}</>;
};

const ContentHook: FunctionComponent<ContentHookProps> = (props) => {
  const { hook } = props;

  const context = useContext(ContentContext);

  const filters = props.filters || context.filters;
  const params = props.params || (context.params as ContentHookParams);
  const required = props.required || false;

  return <>{hook({ filters, params, required })}</>;
};
