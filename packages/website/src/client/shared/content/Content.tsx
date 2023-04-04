import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ContentContext } from './ContentContext';
import {
  CompiledContentComponentVariants,
  ContentComponentParams,
  ContentFunction,
  ContentFunctionParams,
  ContentTags,
} from './types';
import { processContentComponent } from './utils';

export interface ContentComponentProps {
  variants: CompiledContentComponentVariants;

  tags?: ContentTags;
  params?: ContentComponentParams;
  required?: boolean;
}

export interface ContentHookProps {
  function: ContentFunction;

  tags?: ContentTags;
  params?: ContentFunctionParams;
  required?: boolean;
}

export const Content: FunctionComponent<
  ContentComponentProps | ContentHookProps
> = (props) => {
  if ('function' in props) {
    return <ContentFunction {...props} />;
  } else {
    return <ContentComponent {...props} />;
  }
};

const ContentComponent: FunctionComponent<ContentComponentProps> = (props) => {
  const { variants } = props;

  const context = useContext(ContentContext);

  const tags = props.tags || context.tags;
  const params = props.params || context.params;
  const required = props.required || false;

  const component = useMemo(() => {
    return processContentComponent({
      variants,
      tags: tags,
      params,
      required,
    });
  }, [tags, params, required, variants]);

  return <>{component}</>;
};

const ContentFunction: FunctionComponent<ContentHookProps> = (props) => {
  const { function: hook } = props;

  const context = useContext(ContentContext);

  const tags = props.tags || context.tags;
  const params = props.params || (context.params as ContentFunctionParams);
  const required = props.required || false;

  return <>{hook({ tags, params, required })}</>;
};
