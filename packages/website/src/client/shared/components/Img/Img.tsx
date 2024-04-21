import { Image } from '@pcpartdb/shared';
import React, { FunctionComponent, HTMLProps } from 'react';
import { getImagePath } from '../../../image/utils';
import { classNames } from '../../ui/classNames';

export interface ImgProps
  extends Omit<HTMLProps<HTMLImageElement>, 'src' | 'crossOrigin'> {
  src: string | Partial<Image>;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
}

export const Img: FunctionComponent<ImgProps> = (props) => {
  const { src, className, ...htmlProps } = props;

  const url = typeof src === 'string' ? src : getImagePath(src);

  return (
    <img
      {...htmlProps}
      className={classNames('h-auto w-auto', className)}
      src={url}
    />
  );
};
