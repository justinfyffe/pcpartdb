import React, { ChangeEvent, forwardRef, useCallback, useState } from 'react';
import { classNames } from '../../ui';

interface TextareaProps {
  value?: string;

  onChange?: (value: string) => void;

  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const { className, onChange } = props;

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
        value={value || ''}
        className={classNames(
          'border m-0 p-3 rounded text-sm w-full shadow',
          className,
        )}
        onChange={handleChange}
        ref={ref}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
