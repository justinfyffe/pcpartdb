import React, { FormEvent, FunctionComponent } from 'react';
import { classNames } from '../../ui';

interface FormProps {
  className?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;

  children?: React.ReactNode;
}

interface FormActionsProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export const Form: FunctionComponent<FormProps> = (props) => {
  return (
    <form onSubmit={props.onSubmit} className={classNames(props.className)}>
      {props.children}
    </form>
  );
};

export const FormActions: FunctionComponent<FormActionsProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element className={classNames('flex justify-between', props.className)}>
      {props.children}
    </Element>
  );
};
