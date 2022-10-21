import { Button, ButtonVariant } from '@client/shared/components';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ProductRetailModel } from '@shared/product-retail-model';
import React, { FunctionComponent, useCallback } from 'react';
import { ProductRetailModelField } from './product-retail-model-field';

interface ProductRetailModelFieldsProps {
  name: string;
  value?: ProductRetailModel[];
  fields: (ProductRetailModel & { id: string })[];

  onChange?: (value: ProductRetailModel[]) => void;
  onAppend: () => void;
  onRemove: (index: number) => void;
  onSwap: (from: number, to: number) => void;

  className?: string;
  ref?: unknown;
}

export const ProductRetailModelFields: FunctionComponent<
  ProductRetailModelFieldsProps
> = (props) => {
  const { value, fields, onChange, onAppend, onRemove, onSwap } = props;

  const handleChange = useCallback(
    (i: number, retailModel: ProductRetailModel) => {
      fields[i] = { ...fields[i], ...retailModel };
      value[i] = { ...retailModel };
      console.log(value[i]);
      onChange(value);
    },
    [fields, value, onChange],
  );

  const handleShiftUp = useCallback(
    (i: number) => {
      onSwap(i, i - 1);
    },
    [onSwap],
  );

  const handleShiftDown = useCallback(
    (i: number) => {
      onSwap(i, i + 1);
    },
    [onSwap],
  );

  const handleRemove = useCallback(
    (i: number) => {
      onRemove(i);
    },
    [onRemove],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      {fields.map((field, i) => (
        <div key={field.id} className="flex items-stretch">
          <div className="mx-6 text-3xl self-center">{i + 1}</div>

          <ProductRetailModelField
            value={value[i]}
            onChange={(value) => handleChange(i, value)}
            className="flex-1 mb-0"
          />

          <div className="flex gap-3 mx-6 items-center">
            <Button
              variant={ButtonVariant.Default}
              disabled={i === 0}
              onClick={() => handleShiftUp(i)}
              className="h-[46px]"
            >
              <ChevronUpIcon className="w-[16px]" />
            </Button>
            <Button
              variant={ButtonVariant.Default}
              disabled={i === fields.length - 1}
              onClick={() => handleShiftDown(i)}
              className="h-[46px]"
            >
              {' '}
              <ChevronDownIcon className="w-[16px]" />
            </Button>
            <Button
              variant={ButtonVariant.Default}
              onClick={() => handleRemove(i)}
              className="h-[46px]"
            >
              <XMarkIcon className="w-[16px]" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        className="self-end"
        variant={ButtonVariant.Secondary}
        onClick={() => onAppend && onAppend()}
      >
        Add Retail Model
      </Button>
    </div>
  );
};
