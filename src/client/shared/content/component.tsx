import React, { FunctionComponent } from 'react';
import { CompiledContent, ContentKeys, ContentParams } from './types';
import { processContent } from './utils';

export interface ContentProps {
  content: CompiledContent;

  keys?: ContentKeys;
  params?: ContentParams;
}

export const Content: FunctionComponent<ContentProps> = (props) => {
  const { content, keys, params } = props;

  return <>{processContent({ content, keys, params })}</>;
};
