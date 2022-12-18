import React, { FunctionComponent, useContext } from 'react';
import { ContentContext } from './context';
import { CompiledContent, ContentHints, ContentParams } from './types';
import { processContent } from './utils';

export interface ContentProps {
  content: CompiledContent;

  hints?: ContentHints;
  params?: ContentParams;
}

export const Content: FunctionComponent<ContentProps> = (props) => {
  const { content } = props;

  const context = useContext(ContentContext);

  const hints = props.hints || context.hints;
  const params = props.params || context.params;

  return <>{processContent({ content, hints, params })}</>;
};
