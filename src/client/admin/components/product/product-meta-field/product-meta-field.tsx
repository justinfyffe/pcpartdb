import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ProductMetaKey,
  ProductMetaMetadata,
} from '../../../../../shared/product-meta';
import { ProductMetaStringField } from './product-meta-string-field';
import { ProductMetaTextField } from './product-meta-text-field';

type InputType = 'string' | 'text';

interface ProductMetaValue {
  key: ProductMetaKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: ProductMetaMetadata;
  source?: string;
}

const INPUT_TYPES: { [key: string]: InputType } = {
  [ProductMetaKey.Description]: 'text',
};

interface ProductMetaFieldProps {
  type?: InputType;
  field: ProductMetaKey;

  value?: ProductMetaValue;
  onChange?: (value: ProductMetaValue) => void;
}

export const ProductMetaField = forwardRef<unknown, ProductMetaFieldProps>(
  (props, ref) => {
    const { type, field, value: propsValue, onChange } = props;

    const [value, setValue] = useState(propsValue ?? null);
    useEffect(() => setValue(propsValue), [propsValue]);

    const handleChange = useCallback(
      (value: ProductMetaValue) => {
        setValue(value);
        onChange?.(value);
      },
      [onChange],
    );

    const inputType = type ?? INPUT_TYPES[field];
    if (inputType === 'text') {
      return (
        <ProductMetaTextField
          field={field}
          value={value}
          onChange={handleChange}
          ref={ref as Ref<HTMLTextAreaElement>}
        />
      );
    } else if (inputType === 'string') {
      return (
        <ProductMetaStringField
          field={field}
          value={value}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else {
      return (
        <ProductMetaStringField
          field={field}
          value={value}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    }
  },
);
ProductMetaField.displayName = 'ProductMetaField';
