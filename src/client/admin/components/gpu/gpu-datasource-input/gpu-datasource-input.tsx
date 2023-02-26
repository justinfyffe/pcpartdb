import { TextInput } from '@client/shared/components';
import { GpuDataSource } from '@shared/gpus';
import React, { forwardRef, useCallback } from 'react';

interface GpuDataSourceInputProps {
  value?: GpuDataSource;
  onChange?: (value: GpuDataSource) => void;
}

export const GpuDataSourceInput = forwardRef<
  HTMLInputElement,
  GpuDataSourceInputProps
>((props, ref) => {
  const { value, onChange } = props;

  const baseValue = value?.url ?? null;

  const handleChange = useCallback(
    (url: string) => {
      onChange?.(url != null ? { url } : null);
    },
    [onChange],
  );

  return <TextInput value={baseValue} onChange={handleChange} ref={ref} />;
});
GpuDataSourceInput.displayName = 'GpuDataSourceInput';
