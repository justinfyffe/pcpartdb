import {
  Field,
  Select,
  SelectOption,
  SelectValue,
  TextInput,
} from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { ProductType } from '@shared/product';
import {
  ProductBenchmarkKey,
  ProductBenchmarkRequest,
} from '@shared/product-benchmark';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

const GPU_OPTIONS = [
  { label: 'G3D Mark', value: ProductBenchmarkKey.G3dMark },
  { label: 'G2D Mark', value: ProductBenchmarkKey.G2dMark },
  {
    label: '3DMark Time Spy Graphics',
    value: ProductBenchmarkKey.TimeSpyGraphics,
  },
];
const CPU_OPTIONS = [
  { label: 'CPU Mark', value: ProductBenchmarkKey.CpuMark },
  { label: 'Thread Mark', value: ProductBenchmarkKey.ThreadMark },
  {
    label: '3D Mark Time Spy Physics',
    value: ProductBenchmarkKey.TimeSpyPhysics,
  },
];

interface ProductBenchmarkFieldProps {
  type: ProductType;
  benchmarkKey?: ProductBenchmarkKey;

  value?: ProductBenchmarkRequest;
  onChange?: (value: ProductBenchmarkRequest) => void;

  className?: string;
  ref?: unknown;
}

export const ProductBenchmarkField: FunctionComponent<
  ProductBenchmarkFieldProps
> = (props) => {
  const { type, benchmarkKey, value: propsValue, onChange, className } = props;

  const [value, setValue] = useState(propsValue ?? null);
  useEffect(() => setValue(propsValue), [propsValue]);

  const options = useMemo(
    () => (type === ProductType.GPU ? GPU_OPTIONS : CPU_OPTIONS),
    [type],
  );

  const handleKeyChange = useCallback(
    (key: SelectValue) => {
      const newValue = { ...value, key: key as unknown as ProductBenchmarkKey };
      setValue(newValue);
      onChange(newValue);
    },
    [onChange, value],
  );

  const handleScoreChange = useCallback(
    (score: string) => {
      const newValue = { ...value, stringValue: score };
      setValue(newValue);
      onChange(newValue);
    },
    [onChange, value],
  );

  const handleSourceChange = useCallback(
    (source: string) => {
      const newValue = { ...value, source };
      setValue(newValue);
      onChange(newValue);
    },
    [onChange, value],
  );

  return (
    <div className={classNames('flex gap-6 items-center', className)}>
      <Field className="flex-1">
        Benchmark
        {benchmarkKey != null ? (
          <div className="block">{benchmarkKey}</div>
        ) : (
          <Select
            value={value?.key ?? null}
            onChange={handleKeyChange}
            clearable
          >
            {options.map((option) => (
              <SelectOption
                key={option.value}
                label={option.label}
                value={option.value}
              >
                {option.label}
              </SelectOption>
            ))}
          </Select>
        )}
      </Field>

      <Field className="flex-1">
        Score
        <TextInput
          value={value?.stringValue ?? null}
          onChange={handleScoreChange}
          ref={null}
        />
      </Field>

      <Field className="flex-1">
        Source
        <TextInput
          value={value?.source ?? null}
          onChange={handleSourceChange}
          ref={null}
        />
      </Field>
    </div>
  );
};
