import React, { FunctionComponent, HTMLProps } from 'react';
import { Image } from '../../../../types/image';
import { getImageUrl } from '../../../image/image.utils';
import { classNames } from '../../ui/ui.utils';

export interface ImageProps
  extends Omit<HTMLProps<HTMLImageElement>, 'src' | 'crossOrigin'> {
  src: string | Image;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
}

export const Img: FunctionComponent<ImageProps> = (props) => {
  const { src, className, ...htmlProps } = props;

  const url = typeof src === 'string' ? src : getImageUrl(src);

  return (
    <img
      {...htmlProps}
      className={classNames('h-auto w-auto', className)}
      src={url}
    />
  );
};
