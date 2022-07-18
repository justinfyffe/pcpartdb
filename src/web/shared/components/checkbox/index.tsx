import React, { FunctionComponent, HTMLProps, useCallback } from 'react';

interface CheckboxProps
  extends Omit<HTMLProps<HTMLInputElement>, 'onChange' | 'value'> {
  onChange: (value: boolean) => void;
  value: boolean;

  children?: React.ReactNode;
}

export const Checkbox: FunctionComponent<CheckboxProps> = (props) => {
  const { children, onChange, value, ...htmlProps } = props;

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      onChange(evt.target.value != 'true');
    },
    [onChange],
  );

  return (
    <label>
      <input
        {...htmlProps}
        type="checkbox"
        value={value + ''}
        onChange={handleChange}
      />
      {children}
    </label>
  );
};
