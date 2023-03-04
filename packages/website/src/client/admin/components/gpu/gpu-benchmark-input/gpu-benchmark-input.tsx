import { GpuField } from '@pcpartdb/shared';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  ButtonVariant,
  NumberInput,
} from '../../../../shared/components';
import { classNames } from '../../../../shared/ui';

interface GpuBenchmarkInputProps {
  field: string;

  value?: GpuField<number>;
  onChange?: (value: GpuField<number>) => void;

  className?: string;
  ref?: unknown;
}

export const GpuBenchmarkInput: FunctionComponent<GpuBenchmarkInputProps> = (
  props,
) => {
  const { field, value: propsValue, onChange, className } = props;

  const [value, setValue] = useState(propsValue ?? null);
  useEffect(() => setValue(propsValue), [propsValue]);

  const handleScoreChange = useCallback(
    (score: number) => {
      const newValue: GpuField<number> = {
        ...value,
        value: score,
        meta: { fieldKey: field },
      };
      setValue(newValue);
      onChange(newValue);
    },
    [field, onChange, value],
  );

  const handleOverrideClick = useCallback(() => {
    if (value.meta?.dataSource?.enabled == null) {
      return;
    }

    value.meta.dataSource = { enabled: false };
    setValue(value);
    onChange?.(value);
  }, [onChange, value]);

  return (
    <div className={classNames('flex gap-4', className)}>
      <NumberInput
        disabled={value?.meta?.dataSource?.enabled}
        value={value?.value ?? null}
        onChange={handleScoreChange}
        ref={null}
      />
      <Button
        disabled={value?.meta?.dataSource?.enabled !== true}
        variant={ButtonVariant.Default}
        onClick={handleOverrideClick}
      >
        Override
      </Button>
    </div>
  );
};
