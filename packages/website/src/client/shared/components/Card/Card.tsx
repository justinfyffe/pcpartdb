import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui/classNames';
import { Img, ImgProps } from '../Img/Img';

export interface CardProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export interface CardImageProps extends ImgProps {}

export interface CardTitleProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export interface CardContentProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export interface CardActionsProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Card: FunctionComponent<CardProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'bg-light-shades flex flex-col gap-4 items-stretch justify-start p-4 rounded shadow text-slate-700',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};

export const CardImage: FunctionComponent<CardImageProps> = (props) => {
  return (
    <Img
      {...props}
      className={classNames(
        'h-auto m-[-16px_-16px_0] rounded-t rounded-b-none max-h-50 w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)] object-cover',
        props.className,
      )}
    />
  );
};

export const CardTitle: FunctionComponent<CardTitleProps> = (props) => {
  const Element = props.as || 'h3';

  return (
    <Element
      className={classNames(
        'font-medium text-xl text-content mb-0',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};

export const CardContent: FunctionComponent<CardContentProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element className={classNames('flex flex-col gap-4', props.className)}>
      {props.children}
    </Element>
  );
};

export const CardActions: FunctionComponent<CardActionsProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element className={classNames('flex justify-end', props.className)}>
      {props.children}
    </Element>
  );
};
