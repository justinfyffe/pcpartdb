import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ProductBenchmarkKey,
  ProductBenchmarkMetadata,
} from '../../../../types/product-benchmark';
import { Field } from '../../../shared/components/field';
import { TextInput } from '../../../shared/components/input';
import {
  Select,
  SelectOption,
  SelectValue,
} from '../../../shared/components/select';

export interface ProductBenchmarkValue {
  key: ProductBenchmarkKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: ProductBenchmarkMetadata;
  source?: string;
}

interface ProductBenchmarkFieldProps {
  benchmarkKey?: ProductBenchmarkKey;

  value?: ProductBenchmarkValue;
  onChange?: (value: ProductBenchmarkValue) => void;

  ref?: unknown;
}

export const ProductBenchmarkField: FunctionComponent<
  ProductBenchmarkFieldProps
> = (props) => {
  const { benchmarkKey, value: propsValue, onChange } = props;

  const [value, setValue] = useState(propsValue ?? null);
  useEffect(() => setValue(propsValue), [propsValue]);

  const handleKeyChange = useCallback(
    (key: SelectValue) => {
      const newValue = { ...value, key: key as unknown as ProductBenchmarkKey };
      setValue(newValue);
      onChange(newValue);
    },
    [onChange, value],
  );

  const handleScoreChange = useCallback(
    (score: string) => {
      const newValue = { ...value, stringValue: score };
      setValue(newValue);
      onChange(newValue);
    },
    [onChange, value],
  );

  const handleSourceChange = useCallback(
    (source: string) => {
      const newValue = { ...value, source };
      setValue(newValue);
      onChange(newValue);
    },
    [onChange, value],
  );

  return (
    <div className="flex gap-6 items-center">
      <Field className="flex-1">
        Benchmark
        {benchmarkKey != null ? (
          <div className="block">{benchmarkKey}</div>
        ) : (
          <Select
            value={value?.key ?? null}
            onChange={handleKeyChange}
            clearable
          >
            <SelectOption label="Passmark" value={ProductBenchmarkKey.Passmark}>
              Passmark
            </SelectOption>
            <SelectOption label="TimeSpy" value={ProductBenchmarkKey.TimeSpy}>
              3D Mark Time Spy
            </SelectOption>
          </Select>
        )}
      </Field>

      <Field className="flex-1">
        Score
        <TextInput
          value={value?.stringValue ?? null}
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
