import { Textarea } from '@client/shared/components';
import { PartMeta, PartMetaKey } from '@shared/part-meta';
import React, { forwardRef, useCallback } from 'react';

interface PartMetaTextFieldProps {
  field: PartMetaKey;

  value?: PartMeta<string>;
  onChange?: (value: PartMeta<string>) => void;
}

export const PartMetaTextField = forwardRef<
  HTMLTextAreaElement,
  PartMetaTextFieldProps
>((props, ref) => {
  const { field, value, onChange } = props;

  const baseValue = value?.value ?? null;

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(
        value != null ? { value, metadata: { metaKey: field } } : null,
      );
    },
    [field, onChange],
  );

  return <Textarea value={baseValue} onChange={handleChange} ref={ref} />;
});
PartMetaTextField.displayName = 'PartMetaTextField';
