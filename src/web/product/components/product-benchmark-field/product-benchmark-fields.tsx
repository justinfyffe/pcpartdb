import React, { FunctionComponent, useCallback } from 'react';
import { Button, ButtonVariant } from '../../../shared/components/button';
import { ProductBenchmarkValue } from './product-benchmark-field';

interface BenchmarksFieldProps {
  name: string;
  value: ProductBenchmarkValue[];
  fields: (ProductBenchmarkValue & { id: string })[];

  onChange: (values: ProductBenchmarkValue[]) => void;
  onAppend: () => void;
  onRemove: (index: number) => void;

  ref?: unknown;
}

export const BenchmarksField: FunctionComponent<BenchmarksFieldProps> = (
  props,
) => {
  const { fields, value, onAppend, onChange, onRemove } = props;

  const handleFieldChange = useCallback(
    (i: number, benchmark: BenchmarkValue) => {
      fields[i] = { ...fields[i], ...benchmark };
      value[i] = { ...benchmark };
      onChange(value);
    },
    [fields, value, onChange],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      {fields.map((benchmark, i) => (
        <BenchmarkField
          key={benchmark.id}
          value={benchmark}
          onChange={(value) => handleFieldChange(i, value)}
          onRemove={() => onRemove(i)}
        />
      ))}

      <Button
        className="self-end"
        variant={ButtonVariant.Secondary}
        onClick={() => onAppend && onAppend()}
      >
        Add Benchmark
      </Button>
    </div>
  );
};
