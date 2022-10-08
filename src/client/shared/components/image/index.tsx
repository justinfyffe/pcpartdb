import React, { FunctionComponent, HTMLProps } from 'react';
import { Image } from '../../../../shared/image';
import { getImageUrl } from '../../../image/image.utils';
import { classNames } from '../../ui/ui.utils';

export interface ImgProps
  extends Omit<HTMLProps<HTMLImageElement>, 'src' | 'crossOrigin'> {
  src: string | Image;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
}

export const Img: FunctionComponent<ImgProps> = (props) => {
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
