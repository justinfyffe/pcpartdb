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

  ref?: unknown;
}

export const ProductImagesField: FunctionComponent<ProductImagesFieldProps> = (
  props,
) => {
  const { fields, type, value, onAppend, onChange } = props;

  const handleImageChange = useCallback(
    (i: number, productImage: ProductImageValue) => {
      value[i] = productImage;
      onChange(value);
    },
    [onChange, value],
  );

  return (
    <div className="flex flex-col w-full mb-6">
      {fields.map((value, i) => (
        <>
          <div className="flex items-center">
            <div className="mx-6">{i + 1}</div>

            <ProductImageField
              key={value.id}
              type={type}
              value={value}
              onChange={(value) => handleImageChange(i, value)}
              className="flex-1"
            />

            <div className="flex flex-col">
              <Button>Up</Button>
              <Button>Down</Button>
              <Button>X</Button>
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
