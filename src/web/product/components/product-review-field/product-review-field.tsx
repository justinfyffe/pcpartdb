import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ProductReviewKey,
  ProductReviewMetadata,
} from '../../../../types/product-review';
import { Field } from '../../../shared/components/field';
import { TextInput } from '../../../shared/components/input';
import {
  Select,
  SelectOption,
  SelectValue,
} from '../../../shared/components/select';

export interface ProductReviewValue {
  key: ProductReviewKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: ProductReviewMetadata;
  source?: string;
}

interface ProductReviewFieldProps {
  reviewKey?: ProductReviewKey;

  value?: ProductReviewValue;
  onChange?: (value: ProductReviewValue) => void;

  ref?: unknown;
}

export const ProductReviewField: FunctionComponent<ProductReviewFieldProps> = (
  props,
) => {
  const { reviewKey, value: propsValue, onChange } = props;

  const [value, setValue] = useState(propsValue ?? null);
  useEffect(() => setValue(propsValue), [propsValue]);

  const handleKeyChange = useCallback(
    (key: SelectValue) => {
      const newValue = { ...value, key: key as unknown as ProductReviewKey };
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
        Review
        {reviewKey != null ? (
          <div>{reviewKey}</div>
        ) : (
          <Select
            value={value?.key ?? null}
            onChange={handleKeyChange}
            clearable
          >
            <SelectOption label="Amazon" value={ProductReviewKey.Amazon}>
              Amazon
            </SelectOption>
            <SelectOption label="PC Gamer" value={ProductReviewKey.PcGamer}>
              PC Gamer
            </SelectOption>
            <SelectOption label="TechRadar" value={ProductReviewKey.TechRadar}>
              TechRadar
            </SelectOption>
            <SelectOption label="TechSpot" value={ProductReviewKey.TechSpot}>
              TechSpot
            </SelectOption>
            <SelectOption
              label="Tom's Hardware"
              value={ProductReviewKey.TomsHardware}
            >
              Tom&apos;s Hardware
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
