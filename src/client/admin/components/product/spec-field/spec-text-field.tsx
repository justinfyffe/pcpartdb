import { Textarea } from '@client/shared/components';
import { Spec } from '@shared/spec';
import React, { forwardRef, useCallback } from 'react';

interface SpecTextFieldProps {
  value?: Spec<string>;
  onChange?: (value: Spec<string>) => void;
}

export const SpecTextField = forwardRef<
  HTMLTextAreaElement,
  SpecTextFieldProps
>((props, ref) => {
  const { value, onChange } = props;

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { value } : null);
    },
    [onChange],
  );

  return <Textarea value={baseValue} onChange={handleChange} ref={ref} />;
});
SpecTextField.displayName = 'SpecTextField';
