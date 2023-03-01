import { getImagePath } from '@pcpartdb/website/client/image';
import { Image } from '@pcpartdb/website/shared/image';
import React, { FunctionComponent, HTMLProps } from 'react';
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
