import { GpuField, GpuFieldKey } from '@pcpartdb/shared';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Checkbox, NumberInput } from '../../../../shared/components';
import { classNames } from '../../../../shared/ui';

interface GpuBenchmarkInputProps {
  field: GpuFieldKey;

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
      const meta = { fieldKey: field, ...value?.meta };
      const newValue: GpuField<number> = {
        ...value,
        value: score,
        meta,
      };
      setValue(newValue);
      onChange(newValue);
    },
    [field, onChange, value],
  );

  const handleAutoUpdateChange = useCallback(
    (checked: boolean) => {
      const newValue = value || { value: null, meta: { fieldKey: field } };
      newValue.meta.autoUpdate = checked;

      setValue(newValue);
      onChange?.(newValue);
    },
    [field, onChange, value],
  );

  return (
    <div className={classNames('flex gap-4', className)}>
      <NumberInput
        disabled={value?.meta?.autoUpdate}
        value={value?.value ?? null}
        onChange={handleScoreChange}
        ref={null}
      />
      <Checkbox
        value={value?.meta?.autoUpdate === true}
        onChange={handleAutoUpdateChange}
      >
        Auto Update
      </Checkbox>
    </div>
  );
};
