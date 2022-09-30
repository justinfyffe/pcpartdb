import { XIcon } from '@heroicons/react/outline';
import React, { FunctionComponent, useCallback } from 'react';
import { ProductBenchmark } from '../../../../types/product-benchmark';
import { Button, ButtonVariant } from '../../../shared/components/button';
import { ProductBenchmarkField } from './product-benchmark-field';

interface ProductBenchmarkFieldsProps {
  name: string;
  value: ProductBenchmark[];
  fields: (ProductBenchmark & { id: string })[];

  onChange: (values: ProductBenchmark[]) => void;
  onAppend: () => void;
  onRemove: (index: number) => void;

  ref?: unknown;
}

export const ProductBenchmarkFields: FunctionComponent<
  ProductBenchmarkFieldsProps
> = (props) => {
  const { fields, value, onAppend, onChange, onRemove } = props;

  const handleFieldChange = useCallback(
    (i: number, benchmark: ProductBenchmark) => {
      fields[i] = { ...fields[i], ...benchmark };
      value[i] = { ...benchmark, metadata: { order: i } };
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
            className="flex-1"
          />
          <Button
            variant={ButtonVariant.Default}
            onClick={() => onRemove(i)}
            className="self-start px-3 py-3 mt-6"
          >
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
