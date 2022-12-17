import React, { FunctionComponent, useContext } from 'react';
import { ContentContext } from './context';
import { CompiledContent, ContentKeys, ContentParams } from './types';
import { processContent } from './utils';

export interface ContentProps {
  content: CompiledContent;

  keys?: ContentKeys;
  params?: ContentParams;
}

export const Content: FunctionComponent<ContentProps> = (props) => {
  const { content } = props;

  const context = useContext(ContentContext);

  const keys = props.keys || context.keys;
  const params = props.params || context.params;

  return <>{processContent({ content, keys, params })}</>;
};
