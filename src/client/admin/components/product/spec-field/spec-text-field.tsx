import { Textarea } from '@client/shared/components';
import { Spec, SpecKey } from '@shared/spec';
import React, { forwardRef, useCallback } from 'react';

interface SpecTextFieldProps {
  field: SpecKey;

  value?: Spec<string>;
  onChange?: (value: Spec<string>) => void;
}

export const SpecTextField = forwardRef<
  HTMLTextAreaElement,
  SpecTextFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(
        value != null ? { value, metadata: { specKey: field } } : null,
      );
    },
    [field, onChange],
  );

  return <Textarea value={baseValue} onChange={handleChange} ref={ref} />;
});
SpecTextField.displayName = 'SpecTextField';
