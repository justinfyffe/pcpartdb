import { Field, NumberInput, TextInput } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import {
  ProductBenchmarkKey,
  ProductBenchmarkRequest,
} from '@shared/product-benchmark';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';

const LABELS: Record<ProductBenchmarkKey, string> = {
  [ProductBenchmarkKey.CpuMark]: 'CPU Mark',
  [ProductBenchmarkKey.G3dMark]: 'G2D Mark',
  [ProductBenchmarkKey.G2dMark]: 'G3D Mark',
  [ProductBenchmarkKey.PerformanceScore]: 'Performance Score',
  [ProductBenchmarkKey.ThreadMark]: 'Thread Mark',
  [ProductBenchmarkKey.TimeSpyGraphics]: '3DMark Time Spy Graphics',
  [ProductBenchmarkKey.TimeSpyPhysics]: '3DMark Time Spy Physics',
  [ProductBenchmarkKey.ValueScore]: 'Value Score',
};

interface ProductBenchmarkFieldProps {
  benchmarkKey: ProductBenchmarkKey;

  value?: ProductBenchmarkRequest;
  onChange?: (value: ProductBenchmarkRequest) => void;

  className?: string;
  ref?: unknown;
}

export const ProductBenchmarkField: FunctionComponent<
  ProductBenchmarkFieldProps
> = (props) => {
  const { benchmarkKey, value: propsValue, onChange, className } = props;

  const [value, setValue] = useState(propsValue ?? null);
  useEffect(() => setValue(propsValue), [propsValue]);

  const handleScoreChange = useCallback(
    (score: number) => {
      const newValue = { ...value, key: benchmarkKey, floatValue: score };
      setValue(newValue);
      onChange(newValue);
    },
    [onChange, benchmarkKey, value],
  );

  const handleSourceChange = useCallback(
    (source: string) => {
      const newValue = { ...value, key: benchmarkKey, source };
      setValue(newValue);
      onChange(newValue);
    },
    [onChange, benchmarkKey, value],
  );

  return (
    <div className={classNames('flex gap-6 items-center', className)}>
      <Field className="flex-1">
        Benchmark
        <div className="block">{LABELS[benchmarkKey] ?? '--'}</div>
      </Field>

      <Field className="flex-1">
        Score
        <NumberInput
          value={value?.floatValue ?? null}
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
