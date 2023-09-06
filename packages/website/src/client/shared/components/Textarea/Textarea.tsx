import React, { ChangeEvent, forwardRef, useCallback, useState } from 'react';
import { classNames } from '../../ui/classNames';

interface TextareaProps {
  value?: string;

  placeholder?: string;
  disabled?: boolean;

  onChange?: (value: string) => void;

  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const { className, placeholder, disabled, onChange } = props;

    const [value, setValue] = useState<string>(props.value ?? null);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        const newValue = inputValue !== '' ? inputValue : null;
        setValue(newValue);
        onChange?.(newValue);
      },
      [onChange],
    );

    return (
      <textarea
        placeholder={placeholder}
        disabled={disabled}
        value={value || ''}
        className={classNames(
          'border-px m-0 p-3 rounded text-base w-full shadow',
          className,
        )}
        onChange={handleChange}
        ref={ref}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
