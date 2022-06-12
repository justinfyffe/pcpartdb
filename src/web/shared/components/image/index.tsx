import React, { FunctionComponent, HTMLProps } from 'react';

export interface ImageProps
  extends Omit<HTMLProps<HTMLImageElement>, 'src' | 'crossOrigin'> {
  src: string;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
}

export const Image: FunctionComponent<ImageProps> = (props) => {
  const { src, ...htmlProps } = props;

  const url = typeof src === 'string' ? src : '';

  return <img {...htmlProps} src={url} />;
};
