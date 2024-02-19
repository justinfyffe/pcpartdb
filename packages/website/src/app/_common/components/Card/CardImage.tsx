import React from 'react';
import { classNames } from '../../utils/classNames';
import { Img, ImgProps } from '../Img/Img';

export interface CardImageProps extends ImgProps {}

export function CardImage(props: CardImageProps) {
  return (
    <Img
      {...props}
      className={classNames(
        'h-auto m-[-16px_-16px_0] rounded-t rounded-b-none max-h-50 w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)] object-cover',
        props.className,
      )}
    />
  );
}
