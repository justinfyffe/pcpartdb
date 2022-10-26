import { Field, NumberInput, TextInput } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { BenchmarkKey, BenchmarkRequest } from '@shared/benchmark';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';

const LABELS: Record<BenchmarkKey, string> = {
  [BenchmarkKey.CpuMark]: 'CPU Mark',
  [BenchmarkKey.G2dMark]: 'G2D Mark',
  [BenchmarkKey.G3dMark]: 'G3D Mark',
  [BenchmarkKey.PerformanceScore]: 'Performance Score',
  [BenchmarkKey.ThreadMark]: 'Thread Mark',
  [BenchmarkKey.TimeSpyGraphics]: '3DMark Time Spy Graphics',
  [BenchmarkKey.TimeSpyPhysics]: '3DMark Time Spy Physics',
  [BenchmarkKey.ValueScore]: 'Value Score',
};

interface BenchmarkFieldProps {
  benchmarkKey: BenchmarkKey;

  value?: BenchmarkRequest;
  onChange?: (value: BenchmarkRequest) => void;

  className?: string;
  ref?: unknown;
}

export const BenchmarkField: FunctionComponent<BenchmarkFieldProps> = (
  props,
) => {
  const { benchmarkKey, value: propsValue, onChange, className } = props;

  const [value, setValue] = useState(propsValue ?? null);
  useEffect(() => setValue(propsValue), [propsValue]);

  const handleScoreChange = useCallback(
    (score: number) => {
      const newValue = {
        ...value,
        key: benchmarkKey,
        floatValue: score,
      };
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
      <div className="flex-1 max-w-[200px]">{LABELS[benchmarkKey] ?? '--'}</div>

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
