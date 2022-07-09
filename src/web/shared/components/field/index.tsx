import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

interface FieldProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface FieldLabelProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface FieldHintProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface FieldOptionalProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

interface FieldErrorProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Field: FunctionComponent<FieldProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames('block leading-6 mb-0 pb-6', props.className)}
    >
      {props.children}
    </Element>
  );
};

export const FieldLabel: FunctionComponent<FieldLabelProps> = (props) => {
  const Element = props.as || 'label';

  return (
    <Element className={classNames('block', props.className)}>
      {props.children}
    </Element>
  );
};

export const FieldHint: FunctionComponent<FieldHintProps> = (props) => {
  const Element = props.as || 'span';

  return (
    <Element
      className={classNames(
        'text-[#666] block text-[12px] leading-6 mb-[-24px]',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};

export const FieldOptional: FunctionComponent<FieldOptionalProps> = (props) => {
  const Element = props.as || 'span';

  return (
    <Element
      className={classNames(
        'hover:underline text-[#aaa] text-[14px]',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};

export const FieldError: FunctionComponent<FieldErrorProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'text-[#f00] block text-[12px] leading-6 mb-[-24px]',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};
