import {
  generateProductSearchableText,
  ProductField,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/client/shared/components/Button/Button';
import React, { forwardRef, useCallback } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { Input } from '../../../../shared/components/Input/Input';

interface ProductSearchTextInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;

  value?: string;
  onChange?: (value: string) => void;
}

export const ProductSearchTextInput = forwardRef<
  HTMLInputElement,
  ProductSearchTextInputProps
>((props, ref) => {
  const { control, onChange, value } = props;

  const name: string = useWatch({ control, name: 'name' });
  const company: ProductField<string> = useWatch({
    control,
    name: 'company',
  });

  const handleGenerate = useCallback(() => {
    const searchText = generateProductSearchableText({
      company: productFieldFormattedValue(company),
      name,
    });
    onChange?.(searchText);
  }, [company, name, onChange]);

  return (
    <Input
      type="string"
      value={value || ''}
      onChange={onChange}
      ref={ref}
      suffix={<Button onClick={handleGenerate}>Generate</Button>}
    />
  );
});
ProductSearchTextInput.displayName = 'ProductSearchTextInput';
