import React, { FunctionComponent, useContext } from 'react';
import { ContentContext } from './context';
import { CompiledContent, ContentFilters, ContentParams } from './types';
import { processContent } from './utils';

export interface ContentProps {
  compiledContent: CompiledContent;

  filters?: ContentFilters;
  params?: ContentParams;
  required?: boolean;
}

export const Content: FunctionComponent<ContentProps> = (props) => {
  const { compiledContent } = props;

  const context = useContext(ContentContext);

  const filters = props.filters || context.filters;
  const params = props.params || context.params;
  const required = props.required || false;

  return <>{processContent({ compiledContent, filters, params, required })}</>;
};
