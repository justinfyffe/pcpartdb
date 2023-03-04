import { Image } from '@pcpartdb/shared/image';
import React, { FunctionComponent, HTMLProps } from 'react';
import { getImagePath } from '../../../image';
import { classNames } from '../../ui';

export interface ImgProps
  extends Omit<HTMLProps<HTMLImageElement>, 'src' | 'crossOrigin'> {
  src: string | Image;
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
