import { BenchmarKey, ProductBenchmark, ProductType } from '@pcpartdb/shared';
import { NumberInput } from 'packages/website/src/client/shared/components/Input/NumberInput';
import {
  Select,
  SelectValue,
} from 'packages/website/src/client/shared/components/Select/Select';
import { SelectOption } from 'packages/website/src/client/shared/components/Select/SelectOption';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useCallback } from 'react';

const BENCHMARKS = {
  [ProductType.Cpu]: [
    { key: BenchmarKey.CpuMarkMultiThread, label: 'CPU Mark Multi-thread' },
    { key: BenchmarKey.CpuMarkSingleThread, label: 'CPU Mark Single-thread' },
    { key: BenchmarKey.GeekBenchMultiCore, label: 'CPU Mark Multi-core' },
    { key: BenchmarKey.GeekBenchMultiCore, label: 'GeekBench Multi-core' },
    { key: BenchmarKey.GeekBenchSingleCore, label: 'GeekBench Single-core' },
  ],
  [ProductType.Gpu]: [
    { key: BenchmarKey.G3dMark, label: 'G3D Mark' },
    { key: BenchmarKey.G2dMark, label: 'G2D Mark' },
    { key: BenchmarKey.TimespyGraphics, label: 'Time Spy Graphics' },
  ],
};

interface ProductBenchmarkInputProps {
  productType: ProductType;
  value?: ProductBenchmark;
  onChange?: (value: ProductBenchmark) => void;

  className?: string;
  ref?: unknown;
}

export const ProductBenchmarkInput: FunctionComponent<
  ProductBenchmarkInputProps
> = (props) => {
  const { productType, value, onChange, className } = props;

  const handleKeyChange = useCallback(
    (key: SelectValue) => {
      if (key != null) {
        onChange?.({ benchmarkKey: key as BenchmarKey });
      } else {
        onChange?.(null);
      }
    },
    [onChange],
  );

  const handleValueChange = useCallback(
    (benchmarkValue: number) => {
      onChange?.({ benchmarkKey: value?.benchmarkKey, value: benchmarkValue });
    },
    [onChange, value?.benchmarkKey],
  );

  return (
    <div className={classNames('flex gap-4', className)}>
      <Select
        placeholder="Select Benchmark"
        value={value?.benchmarkKey}
        onChange={handleKeyChange}
        className="flex-1"
        clearable
      >
        {BENCHMARKS[productType].map((benchmark) => (
          <SelectOption
            key={benchmark.key}
            label={benchmark.label}
            value={benchmark.key}
          >
            {benchmark.label}
          </SelectOption>
        ))}
      </Select>

      <NumberInput
        placeholder="Benchmark Value"
        disabled={value?.benchmarkKey == null}
        value={value?.value}
        onChange={handleValueChange}
        className="flex-1"
      />
    </div>
  );
};
