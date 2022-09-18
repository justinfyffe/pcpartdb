import { XIcon } from '@heroicons/react/outline';
import React, { FunctionComponent, useCallback } from 'react';
import { ProductBenchmarkKey } from '../../../types/product-benchmark';
import { Button, ButtonVariant } from '../../shared/components/button';
import { Field } from '../../shared/components/field';
import { Input } from '../../shared/components/input';
import {
  Select,
  SelectOption,
  SelectValue,
} from '../../shared/components/select';

export interface BenchmarkValue {
  key: ProductBenchmarkKey;
  value: string;
  source: string;
}

interface BenchmarksFieldProps {
  name: string;
  value: BenchmarkValue[];
  fields: (BenchmarkValue & { id: string })[];

  onChange: (values: BenchmarkValue[]) => void;
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
      value[i] = benchmark;
      onChange(value);
    },
    [onChange, value],
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

interface BenchmarkFieldProps {
  value: BenchmarkValue;

  onChange: (benchmark: BenchmarkValue) => void;
  onRemove: () => void;
}

const BenchmarkField: FunctionComponent<BenchmarkFieldProps> = (props) => {
  const { value, onChange, onRemove } = props;

  const handleKeyChange = useCallback(
    (key: SelectValue) => {
      value.key = key as unknown as ProductBenchmarkKey;
      onChange(value);
    },
    [onChange, value],
  );

  const handleValueChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      value.value = evt.target.value;
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
    <div className="flex gap-6 items-center">
      <Field className="flex-1">
        Benchmark
        <Select value={value.key} onChange={handleKeyChange} clearable>
          <SelectOption label="Passmark" value={ProductBenchmarkKey.Passmark}>
            Passmark
          </SelectOption>
          <SelectOption label="TimeSpy" value={ProductBenchmarkKey.TimeSpy}>
            3D Mark Time Spy
          </SelectOption>
        </Select>
      </Field>

      <Field className="flex-1">
        Value
        <Input value={value.value} onChange={handleValueChange} ref={null} />
      </Field>

      <Field className="flex-1">
        Source
        <Input value={value.source} onChange={handleSourceChange} ref={null} />
      </Field>

      <Button
        className="w-[46px] h-[46px]"
        variant={ButtonVariant.Default}
        onClick={onRemove}
      >
        <XIcon className="w-[16px]" />
      </Button>
    </div>
  );
};
