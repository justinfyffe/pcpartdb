import { XIcon } from '@heroicons/react/outline';
import React, { FunctionComponent, useCallback } from 'react';
import { Button, ButtonVariant } from '../../../shared/components/button';
import {
  ProductBenchmarkField,
  ProductBenchmarkValue,
} from './product-benchmark-field';

interface ProductBenchmarkFieldsProps {
  name: string;
  value: ProductBenchmarkValue[];
  fields: (ProductBenchmarkValue & { id: string })[];

  onChange: (values: ProductBenchmarkValue[]) => void;
  onAppend: () => void;
  onRemove: (index: number) => void;

  ref?: unknown;
}

export const ProductBenchmarkFields: FunctionComponent<
  ProductBenchmarkFieldsProps
> = (props) => {
  const { fields, value, onAppend, onChange, onRemove } = props;

  const handleFieldChange = useCallback(
    (i: number, benchmark: ProductBenchmarkValue) => {
      fields[i] = { ...fields[i], ...benchmark };
      value[i] = { ...benchmark };
      onChange(value);
    },
    [fields, value, onChange],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      {fields.map((benchmark, i) => (
        <div key={benchmark.id} className="flex gap-6">
          <ProductBenchmarkField
            value={value[i]}
            onChange={(value) => handleFieldChange(i, value)}
          />
          <Button variant={ButtonVariant.Default} onClick={() => onRemove(i)}>
            <XIcon className="w-4" />
          </Button>
        </div>
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
