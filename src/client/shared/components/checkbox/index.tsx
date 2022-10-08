import React, {
  forwardRef,
  HTMLProps,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { classNames } from '../../ui';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const { children, className, onChange, value: propsValue } = props;

    const [value, setValue] = useState(propsValue);

    useEffect(() => setValue(propsValue), [propsValue]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value === 'true';
        setValue(newValue);
        onChange?.(newValue);
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
          ref={ref}
        />
        {children}
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';

interface CheckboxProps
  extends Omit<HTMLProps<HTMLInputElement>, 'onChange' | 'value'> {
  onChange?: (value: boolean) => void;
  value?: boolean;

  children?: React.ReactNode;
}
