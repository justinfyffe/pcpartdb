import { Textarea } from '@client/shared/components';
import { SpecKey, SpecRequest } from '@shared/spec';
import React, { forwardRef, useCallback } from 'react';

interface SpecTextFieldProps {
  field: SpecKey;

  value?: SpecRequest;
  onChange?: (value: SpecRequest) => void;
}

export const SpecTextField = forwardRef<
  HTMLTextAreaElement,
  SpecTextFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.textValue ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value != null ? { key: field, textValue: value } : null);
    },
    [field, onChange],
  );

  return <Textarea value={baseValue} onChange={handleChange} ref={ref} />;
});
SpecTextField.displayName = 'SpecTextField';
