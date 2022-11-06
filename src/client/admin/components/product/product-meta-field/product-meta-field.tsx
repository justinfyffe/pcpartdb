import { ProductMeta, ProductMetas } from '@shared/product-meta';
import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ProductMetaStringField } from './product-meta-string-field';
import { ProductMetaTextField } from './product-meta-text-field';

type InputType = 'string' | 'text';

const INPUT_TYPES: Record<string, InputType> = {
  description: 'text',
};

interface ProductMetaFieldProps {
  type?: InputType;
  field: keyof ProductMetas;

  value?: ProductMeta;
  onChange?: (value: ProductMeta) => void;
}

export const ProductMetaField = forwardRef<unknown, ProductMetaFieldProps>(
  (props, ref) => {
    const { type, field, value: propsValue, onChange } = props;

    const [value, setValue] = useState(propsValue ?? null);
    useEffect(() => setValue(propsValue), [propsValue]);

    const handleChange = useCallback(
      (value: ProductMeta) => {
        setValue(value);
        onChange?.(value);
      },
      [onChange],
    );

    const inputType = type ?? INPUT_TYPES[field];
    if (inputType === 'text') {
      return (
        <ProductMetaTextField
          value={value as ProductMeta<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLTextAreaElement>}
        />
      );
    } else if (inputType === 'string') {
      return (
        <ProductMetaStringField
          value={value as ProductMeta<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    } else {
      return (
        <ProductMetaStringField
          value={value as ProductMeta<string>}
          onChange={handleChange}
          ref={ref as Ref<HTMLInputElement>}
        />
      );
    }
  },
);
ProductMetaField.displayName = 'ProductMetaField';
