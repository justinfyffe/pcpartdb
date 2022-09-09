import {
  ChevronDownIcon,
  ChevronUpIcon,
  XIcon,
} from '@heroicons/react/outline';
import React, { FunctionComponent, useCallback } from 'react';
import { ProductImageType } from '../../../types/product-image';
import { Button, ButtonVariant } from '../../shared/components/button';
import { ProductImageField, ProductImageValue } from './product-image-field';

interface ProductImagesFieldProps {
  name: string;
  type: ProductImageType;
  value: ProductImageValue[];
  fields: (ProductImageValue & { id: string })[];

  onChange: (values: ProductImageValue[]) => void;
  onAppend: () => void;
  onRemove: (index: number) => void;
  onSwap: (from: number, to: number) => void;

  ref?: unknown;
}

export const ProductImagesField: FunctionComponent<ProductImagesFieldProps> = (
  props,
) => {
  const { fields, type, value, onAppend, onRemove, onSwap, onChange } = props;

  const handleImageChange = useCallback(
    (i: number, productImage: ProductImageValue) => {
      value[i] = productImage;
      onChange(value);
    },
    [onChange, value],
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
      {fields.map((value, i) => (
        <>
          <div className="flex items-stretch mb-6">
            <div className="mx-6 text-3xl self-center">{i + 1}</div>

            <ProductImageField
              key={value.id}
              type={type}
              value={value}
              onChange={(value) => handleImageChange(i, value)}
              className="flex-1 mb-0"
            />

            <div className="flex flex-col gap-2 mx-2 justify-between">
              <div className="flex flex-col gap-2">
                <Button
                  variant={ButtonVariant.Default}
                  disabled={i === 0}
                  onClick={() => handleShiftUp(i)}
                >
                  <ChevronUpIcon className="w-[16px]" />
                </Button>
                <Button
                  variant={ButtonVariant.Default}
                  disabled={i === fields.length - 1}
                  onClick={() => handleShiftDown(i)}
                >
                  {' '}
                  <ChevronDownIcon className="w-[16px]" />
                </Button>
              </div>
              <div>
                <Button
                  variant={ButtonVariant.Default}
                  onClick={() => handleRemove(i)}
                >
                  <XIcon className="w-[16px]" />
                </Button>
              </div>
            </div>
          </div>
        </>
      ))}

      <Button
        className="self-end"
        variant={ButtonVariant.Secondary}
        onClick={() => onAppend && onAppend()}
      >
        Add Image
      </Button>
    </div>
  );
};
