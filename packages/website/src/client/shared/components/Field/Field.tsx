import React, { createContext, FunctionComponent, useMemo } from 'react';
import { useLayout } from '../../layouts';
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

  const layout = useLayout();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fieldId = useMemo(() => layout.fieldCounter++, []);
  const context = useMemo(
    () => ({ fieldId: `field-id-${fieldId}` }),
    [fieldId],
  );

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
        'text-[#666] block text-xs leading-6 -mb-6',
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
    <Element className={classNames('text-[#aaa] text-xs', props.className)}>
      {props.children}
    </Element>
  );
};

export const FieldError: FunctionComponent<FieldErrorProps> = (props) => {
  const Element = props.as || 'div';

  return (
    <Element
      className={classNames(
        'text-[#f00] block text-2xs leading-6 -mb-6',
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
};
