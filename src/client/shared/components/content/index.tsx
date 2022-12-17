import { Content, ContentParams } from '@content/types';
import React, { FunctionComponent } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ContentProps {
  content: Content;
  params?: ContentParams;
}

export const ContentProps: FunctionComponent<ContentProps> = (props) => {
  return <></>;
};
