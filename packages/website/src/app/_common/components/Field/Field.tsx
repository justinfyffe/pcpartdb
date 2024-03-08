import React from 'react';
import { classNames } from '../../utils/classNames';
import { FieldProvider } from './FieldProvider';

interface FieldProps {
  fieldId: string;
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function Field(props: FieldProps) {
  const Element = props.as || 'div';

  return (
    <FieldProvider fieldId={props.fieldId}>
      <Element className={classNames('block leading-6 mb-0', props.className)}>
        <label htmlFor={props.fieldId} className="block leading-6 mb-0 pb-6">
          {props.children}
        </label>
      </Element>
    </FieldProvider>
  );
}
