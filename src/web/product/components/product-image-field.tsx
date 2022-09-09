import React, { FunctionComponent, useCallback } from 'react';
import { Image } from '../../../types/image';
import { ProductImageType } from '../../../types/product-image';
import { ImageInput } from '../../image/components/image-input';
import { classNames } from '../../shared/ui/ui.utils';

export interface ProductImageValue {
  type: ProductImageType;
  image: Image;
}

interface ProductImageFieldProps {
  type: ProductImageType;
  value: ProductImageValue;

  onChange: (value: ProductImageValue) => void;

  className?: string;
  ref?: unknown;
}

export const ProductImageField: FunctionComponent<ProductImageFieldProps> = (
  props,
) => {
  const { type, value, onChange, className } = props;

  const handleChange = useCallback(
    (image: Image) => {
      value.type = type;
      value.image = image;
      onChange(value);
    },
    [onChange, type, value],
  );

  return (
    <ImageInput
      value={value.image}
      recommendedHeight={300}
      recommendedWidth={300}
      onChange={handleChange}
      className={classNames('mb-6', className)}
    />
  );
};
