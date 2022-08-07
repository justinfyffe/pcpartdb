import React, { FunctionComponent, HTMLProps, useCallback } from 'react';
import { classNames } from '../../ui/ui.utils';

interface CheckboxProps
  extends Omit<HTMLProps<HTMLInputElement>, 'onChange' | 'value'> {
  onChange?: (value: boolean) => void;
  value?: boolean;

  children?: React.ReactNode;
}

export const Checkbox: FunctionComponent<CheckboxProps> = (props) => {
  const { children, className, onChange, value, ...htmlProps } = props;

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      onChange(evt.target.value != 'true');
    },
    [onChange],
  );

  return (
    <label className={classNames('block', className)}>
      <input
        type="checkbox"
        value={value + ''}
        onChange={handleChange}
        className={classNames('mr-2')}
        {...htmlProps}
      />
      {children}
    </label>
  );
};
