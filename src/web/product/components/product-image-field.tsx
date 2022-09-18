import React, { FunctionComponent, useCallback } from 'react';
import { Image } from '../../../types/image';
import { ProductImageType } from '../../../types/product-image';
import { ImageInput } from '../../image/components/image-input';

export interface ProductImageValue {
  type: ProductImageType;
  image: Image;
}

interface ProductImageFieldProps {
  type: ProductImageType;
  value: ProductImageValue;

  onChange: (value: ProductImageValue) => void;
}

export const ProductImageField: FunctionComponent<ProductImageFieldProps> = (
  props,
) => {
  const { type, value, onChange } = props;

  const handleChange = useCallback(
    (image: Image) => {
      onChange({ type, image });
    },
    [onChange, type],
  );

  return (
    <div>
      <ImageInput
        value={value.image}
        recommendedHeight={300}
        recommendedWidth={300}
        onChange={handleChange}
      />
    </div>
  );
};
