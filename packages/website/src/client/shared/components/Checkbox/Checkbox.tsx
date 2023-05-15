import React, { forwardRef, HTMLProps, useCallback } from 'react';
import { classNames } from '../../ui';

interface CheckboxProps
  extends Omit<HTMLProps<HTMLInputElement>, 'onChange' | 'value'> {
  onChange?: (value: boolean) => void;
  value?: boolean;

  children?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const { children, className, onChange, value, checked, disabled } = props;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        onChange?.(newValue);
      },
      [onChange],
    );

    return (
      <label
        className={classNames(disabled ? '' : 'cursor-pointer', className)}
      >
        <input
          type="checkbox"
          checked={checked || value || false}
          disabled={disabled}
          onChange={handleChange}
          className={classNames('mr-2')}
          ref={ref}
        />
        {children}
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';
