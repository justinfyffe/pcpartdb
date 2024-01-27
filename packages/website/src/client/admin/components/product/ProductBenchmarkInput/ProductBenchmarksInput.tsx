import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ProductBenchmark, ProductType } from '@pcpartdb/shared';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import { WarningButton } from 'packages/website/src/client/shared/components/Button/WarningButton';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProductBenchmarkInput } from './ProductBenchmarkInput';

export interface ProductBenchmarksInputProps {
  productType: ProductType;
  name: string;
  value: ProductBenchmark[];

  onChange: (values: ProductBenchmark[]) => void;

  ref?: unknown;
}

export const ProductBenchmarksInput: FunctionComponent<
  ProductBenchmarksInputProps
> = (props) => {
  const { productType, value, onChange } = props;
  const emptyValue = useMemo(() => [] as ProductBenchmark[], []);

  // TODO: this could probably be made into a hook
  const [rowKeys] = useState(() => {
    const ret: string[] = [];
    value?.forEach(() => ret.push(uuidv4()));
    return ret;
  });

  const handleBenchmarkInput = useCallback(
    (i: number, benchmark: ProductBenchmark) => {
      const newValue: ProductBenchmark[] =
        value != null ? [...value] : emptyValue;
      newValue[i] = benchmark != null ? benchmark : null;
      onChange(newValue);
    },
    [emptyValue, value, onChange],
  );

  const handleAppend = useCallback(() => {
    const newValue: ProductBenchmark[] =
      value != null ? [...value] : emptyValue;
    rowKeys.push(uuidv4());
    newValue.push(null);
    onChange(newValue);
  }, [rowKeys, emptyValue, value, onChange]);

  const handleShiftUp = useCallback(
    (i: number) => {
      const newValue: ProductBenchmark[] = [...value];

      // Swap values and row keys
      [newValue[i], newValue[i - 1]] = [newValue[i - 1], newValue[i]];
      [rowKeys[i], rowKeys[i - 1]] = [rowKeys[i - 1], rowKeys[i]];

      onChange(newValue);
    },
    [rowKeys, value, onChange],
  );

  const handleShiftDown = useCallback(
    (i: number) => {
      const newValue: ProductBenchmark[] = [...value];

      // Swap values and row keys
      [newValue[i], newValue[i + 1]] = [newValue[i + 1], newValue[i]];
      [rowKeys[i], rowKeys[i + 1]] = [rowKeys[i + 1], rowKeys[i]];

      onChange(newValue);
    },
    [rowKeys, value, onChange],
  );

  const handleRemove = useCallback(
    (i: number) => {
      const newValue: ProductBenchmark[] = [...value];
      newValue.splice(i, 1);
      rowKeys.splice(i, 1);
      onChange(newValue.length > 0 ? newValue : null);
    },
    [rowKeys, value, onChange],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      {value?.map((image, i) => (
        <div key={rowKeys[i]} className="flex items-stretch mb-6">
          <ProductBenchmarkInput
            productType={productType}
            value={image}
            onChange={(value) => handleBenchmarkInput(i, value)}
            className="flex-1 mb-0"
          />

          <div className="flex flex-row gap-2 mx-2 justify-between">
            <GenericButton disabled={i === 0} onClick={() => handleShiftUp(i)}>
              <ChevronUpIcon className="w-4" />
            </GenericButton>

            <GenericButton
              disabled={i === value.length - 1}
              onClick={() => handleShiftDown(i)}
            >
              <ChevronDownIcon className="w-4" />
            </GenericButton>

            <GenericButton onClick={() => handleRemove(i)}>
              <XMarkIcon className="w-4" />
            </GenericButton>
          </div>
        </div>
      ))}

      <WarningButton className="self-end" onClick={() => handleAppend()}>
        New Benchmark
      </WarningButton>
    </div>
  );
};
