import React, { FunctionComponent } from 'react';
import { classNames } from '../../ui/ui.utils';
import { Image, ImageProps } from '../image';

interface CardProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface CardImageProps extends ImageProps {}

interface CardTitleProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface CardContentProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface CardActionsProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Card: FunctionComponent<CardProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'bg-gray-50 flex flex-col items-stretch justify-between p-6 rounded shadow text-slate-700',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};

export const CardImage: FunctionComponent<CardImageProps> = (props) => {
  return (
    <Image
      {...props}
      className={classNames(
        'h-auto m-[-24px_-24px_24px] rounded-t rounded-b-none max-h-[200px] w-[calc(100%_+_48px)] max-w-[calc(100%_+_48px)]',
        props.className,
      )}
    />
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
