import { Field, NumberInput, TextInput } from '@client/shared/components';
import { classNames } from '@client/shared/ui';
import { Benchmark, BenchmarkKey } from '@shared/benchmark';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';

const LABELS: Record<string, string> = {
  g2dMark: 'G2D Mark',
  g3dMark: 'G3D Mark',
  timeSpyGraphics: '3DMark Time Spy Graphics',
};

interface BenchmarkFieldProps {
  field: BenchmarkKey;

  value?: Benchmark<number>;
  onChange?: (value: Benchmark<number>) => void;

  className?: string;
  ref?: unknown;
}

export const BenchmarkField: FunctionComponent<BenchmarkFieldProps> = (
  props,
) => {
  const { field, value: propsValue, onChange, className } = props;

  const [value, setValue] = useState(propsValue ?? null);
  useEffect(() => setValue(propsValue), [propsValue]);

  const handleScoreChange = useCallback(
    (score: number) => {
      const newValue: Benchmark<number> = {
        ...value,
        value: score,
        metadata: { benchmarkKey: field },
      };
      setValue(newValue);
      onChange(newValue);
    },
    [field, onChange, value],
  );

  const handleSourceChange = useCallback(
    (source: string) => {
      const newValue: Benchmark<number> = {
        ...value,
        source,
        metadata: { benchmarkKey: field },
      };
      setValue(newValue);
      onChange(newValue);
    },
    [field, onChange, value],
  );

  return (
    <div className={classNames('flex gap-6 items-center', className)}>
      <div className="flex-1 max-w-50">{LABELS[field] ?? '--'}</div>

      <Field className="flex-1">
        Score
        <NumberInput
          value={value?.value ?? null}
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
