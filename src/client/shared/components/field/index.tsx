import React, { createContext, FunctionComponent, useState } from 'react';
import { useGon } from '../../gon';
import { classNames } from '../../ui';

interface FieldState {
  fieldId: string;
}

export const FieldContext = createContext<FieldState>({
  fieldId: '',
});

interface FieldProps {
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

  const gon = useGon();

  const [context] = useState(() => {
    const counter = gon.fieldCounter++;
    return { fieldId: `field-id-${counter}` };
  });

  return (
    <FieldContext.Provider value={context}>
      <Element className={classNames('block leading-6 mb-0', props.className)}>
        <label htmlFor={context.fieldId} className="block leading-6 mb-0 pb-6">
          {props.children}
        </label>
      </Element>
    </FieldContext.Provider>
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
