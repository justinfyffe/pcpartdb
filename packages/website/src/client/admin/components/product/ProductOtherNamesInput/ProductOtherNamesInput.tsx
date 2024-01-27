import { generateProductOtherNames } from '@pcpartdb/shared';
import { Button } from 'packages/website/src/client/shared/components/Button/Button';
import { ChipsInput } from 'packages/website/src/client/shared/components/Input/ChipsInput';
import React, { forwardRef, useCallback } from 'react';
import { Control, useWatch } from 'react-hook-form';

export interface ProductOtherNamesInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;

  value?: string[];
  onChange?: (value: string[]) => void;
}

export const ProductOtherNamesInput = forwardRef<
  HTMLInputElement,
  ProductOtherNamesInputProps
>((props, ref) => {
  const { control, onChange, value } = props;

  const name: string = useWatch({ control, name: 'name' });
  const company: string = useWatch({
    control,
    name: 'company',
  });

  const handleGenerate = useCallback(() => {
    const otherNames = generateProductOtherNames({
      company,
      name,
    });
    onChange?.(otherNames);
  }, [company, name, onChange]);

  return (
    <ChipsInput
      value={value}
      onChange={onChange}
      ref={ref}
      suffix={<Button onClick={handleGenerate}>Generate</Button>}
    />
  );
});
ProductOtherNamesInput.displayName = 'ProductOtherNamesInput';
