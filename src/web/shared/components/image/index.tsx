import React, { FunctionComponent, HTMLProps } from 'react';
import { classNames } from '../../ui/ui.utils';

export interface ImageProps
  extends Omit<HTMLProps<HTMLImageElement>, 'src' | 'crossOrigin'> {
  src: string;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
}

export const Image: FunctionComponent<ImageProps> = (props) => {
  const { src, className, ...htmlProps } = props;

  const url = typeof src === 'string' ? src : '';

  return (
    <img
      {...htmlProps}
      className={classNames('h-auto w-auto', className)}
      src={url}
    />
  );
};
