import React from 'react';
import { classNames } from '../../utils/classNames';
import { FieldProvider } from './FieldProvider';

interface FieldProps {
  as?: React.ElementType;
  className?: string;

  children?: React.ReactNode;
}

export function Field(props: FieldProps) {
  const Element = props.as || 'div';

  const fieldId = `field-id-${Math.floor(Math.random() * 99_999)}`;

  return (
    <FieldProvider fieldId={fieldId}>
      <Element className={classNames('block leading-6 mb-0', props.className)}>
        <label htmlFor={fieldId} className="block leading-6 mb-0 pb-6">
          {props.children}
        </label>
      </Element>
    </FieldProvider>
  );
}
