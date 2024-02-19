import { Image } from '@pcpartdb/shared';
import React, { HTMLProps } from 'react';
import { classNames } from '../../utils/classNames';
import { imagePath } from '../../utils/imagePath';

export interface ImgProps
  extends Omit<HTMLProps<HTMLImageElement>, 'src' | 'crossOrigin'> {
  src: string | Image;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
}

export function Img(props: ImgProps) {
  const { src, className, ...htmlProps } = props;

  const url = typeof src === 'string' ? src : imagePath(src);

  return (
    <img
      {...htmlProps}
      className={classNames('h-auto w-auto', className)}
      src={url}
    />
  );
}
