import { formatGpuField, GpuField, GpuFieldKey } from '@pcpartdb/shared';
import { Checkbox } from 'packages/website/src/client/shared/components/Checkbox/Checkbox';
import { NumberInput } from 'packages/website/src/client/shared/components/Input/NumberInput';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface GpuBenchmarkInputProps {
  field: GpuFieldKey;

  value?: GpuField<number>;
  parentValue?: GpuField<number>;
  onChange?: (value: GpuField<number>) => void;

  className?: string;
  ref?: unknown;
}

export const GpuBenchmarkInput: FunctionComponent<GpuBenchmarkInputProps> = (
  props,
) => {
  const { field, value: propsValue, parentValue, onChange, className } = props;

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

  const placeholder = useMemo(() => formatGpuField(parentValue), [parentValue]);

  return (
    <div className={classNames('flex gap-4', className)}>
      <NumberInput
        placeholder={placeholder}
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
