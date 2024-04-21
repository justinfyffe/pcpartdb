import { Image, ProductImage } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback } from 'react';
import { useImageCache } from '../../../../shared/cache/ImageCache';
import { ImageInput } from '../../image/ImageInput/ImageInput';

interface ProductImageInputProps {
  value?: ProductImage;
  onChange?: (value: ProductImage) => void;

  className?: string;
  ref?: unknown;
}

export const ProductImageInput: FunctionComponent<ProductImageInputProps> = (
  props,
) => {
  const { value, onChange, className } = props;
  const imageCache = useImageCache();

  const handleChange = useCallback(
    (image: Partial<Image>) => {
      onChange?.(image != null ? { imageId: image.id } : null);
    },
    [onChange],
  );

  return (
    <ImageInput
      value={value != null ? imageCache.get(value.imageId) : null}
      recommendedHeight={300}
      recommendedWidth={300}
      onChange={handleChange}
      className={className}
    />
  );
};
