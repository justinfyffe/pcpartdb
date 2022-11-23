import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui';
import { Img, ImgProps } from '../image';

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
        'bg-gray-50 flex flex-col items-stretch justify-start p-4 rounded shadow text-slate-700',
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
        'h-auto m-[-24px_-16px_24px] rounded-t rounded-b-none max-h-[200px] w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)] object-cover',
        props.className,
      )}
    />
  );
};

export const CardSplitImage: FunctionComponent<CardImageProps> = (props) => {
  return (
    <div className="relative flex gap-[2px] m-[-24px_-16px_24px] rounded-t rounded-b-none h-[200px] w-[calc(100%_+_32px)] max-w-[calc(100%_+_48px)] overflow-hidden">
      <Img
        src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"
        className={classNames(
          'h-[200px] object-cover overflow-hidden',
          props.className,
        )}
      />

      <Img
        src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"
        className={classNames(
          'h-[200px] object-cover overflow-hidden',
          props.className,
        )}
      />

      <div className="flex gap-4 w-full h-full absolute items-end justify-around pb-6">
        <div className="flex-1 text-[#ececec] font-bold px-1 py-1 text-md bg-[rgba(118,185,0,0.7)] border-y border-gray-50 text-center">
          RTX 3070
        </div>
        <div className="flex-1 text-[#ececec] font-bold px-1 py-1 text-md bg-[rgba(239,7,7,0.7)] border-y border-gray-50 text-center">
          RTX 3060
        </div>
      </div>

      <div className="flex w-full h-full items-end justify-center absolute pb-4">
        <div className="text-[#ececec] font-bold py-2 px-3 text-2xl rounded bg-[rgba(51,65,85,1)] border-2 border-gray-50">
          VS
        </div>
      </div>
    </div>
  );
};

export const CardTitle: FunctionComponent<CardTitleProps> = (props) => {
  const Element = props.as || 'h1';

  return (
    <Element
      className={classNames(
        'font-medium text-xl text-indigo-500',
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
    <Element className={classNames('my-6', props.className)}>
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
