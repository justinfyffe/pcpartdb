import React, { FunctionComponent, useCallback } from 'react';
import { ProductBenchmarkKey } from '../../../types/product-benchmark';
import { Button } from '../../shared/components/button';
import { Field } from '../../shared/components/field';
import { Input } from '../../shared/components/input';

interface BenchmarkValue {
  key: ProductBenchmarkKey;
  value: number;
  source?: string;
}

interface BenchmarkFieldsProps {
  name: string;
  value: BenchmarkValue[];

  onChange: (values: BenchmarkValue[]) => void;
  onAppend?: () => void;
  onRemove?: (index: number) => void;

  ref?: any;
}

export const BenchmarkFields: FunctionComponent<BenchmarkFieldsProps> = (
  props,
) => {
  const { value, onAppend, onChange } = props;

  const handleFieldChange = useCallback(
    (i: number, benchmark: BenchmarkValue) => {
      value[i] = benchmark;
      onChange(value);
    },
    [onChange, value],
  );

  return (
    <>
      {value.map((benchmark, i) => (
        <BenchmarkField
          key={i}
          value={benchmark}
          onChange={(value) => handleFieldChange(i, value)}
        />
      ))}

      <Button onClick={() => onAppend && onAppend()}>Add</Button>
    </>
  );
};

interface BenchmarkFieldProps {
  value: BenchmarkValue;

  onChange: (benchmark: BenchmarkValue) => void;
  onRemove?: () => void;
}

export const BenchmarkField: FunctionComponent<BenchmarkFieldProps> = (
  props,
) => {
  const { value, onChange } = props;

  const handleKeyChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      value.key = evt.target.value as unknown as ProductBenchmarkKey;
      onChange(value);
    },
    [onChange, value],
  );

  const handleValueChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      value.value = Number(evt.target.value);
      onChange(value);
    },
    [onChange, value],
  );

  const handleSourceChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      value.source = evt.target.value;
      onChange(value);
    },
    [onChange, value],
  );

  return (
    <div className="flex">
      <Field>
        Benchmark
        <Input onChange={handleKeyChange} />
      </Field>

      <Field>
        Value
        <Input type="number" step="0.01" onChange={handleValueChange} />
      </Field>

      <Field>
        Source
        <Input onChange={handleSourceChange} />
      </Field>

      <Button>X</Button>
    </div>
  );
};
