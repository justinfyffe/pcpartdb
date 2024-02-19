import React from 'react';
import { classNames } from '../../utils/classNames';

interface FormActionsProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function FormActions(props: FormActionsProps) {
  const Element = props.as || 'div';

  return (
    <Element className={classNames('flex justify-between', props.className)}>
      {props.children}
    </Element>
  );
}
