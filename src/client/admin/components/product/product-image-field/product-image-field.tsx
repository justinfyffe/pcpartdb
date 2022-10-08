import React, { FunctionComponent, useCallback, useState } from 'react';
import { Image } from '../../../../../shared/image';
import {
  ProductImageRequest,
  ProductImageType,
} from '../../../../../shared/product-image';
import { ImageCache } from '../../../../shared/cache';
import { classNames } from '../../../../shared/ui/ui.utils';
import { ImageInput } from '../../image';

interface ProductImageFieldProps {
  type: ProductImageType;

  value?: ProductImageRequest;
  onChange?: (value: ProductImageRequest) => void;

  className?: string;
  ref?: unknown;
}

export const ProductImageField: FunctionComponent<ProductImageFieldProps> = (
  props,
) => {
  const { type, value, onChange, className } = props;

  const [image, setImage] = useState<Image>(() => {
    if (value == null) {
      return null;
    }

    return ImageCache.get(value.imageId);
  });

  const handleChange = useCallback(
    (image: Image) => {
      const newValue: ProductImageRequest =
        image != null
          ? {
              type,
              imageId: image.id,
              metadata: value?.metadata,
            }
          : null;

      onChange?.(newValue);
      setImage(image);
    },
    [type, value, onChange],
  );

  return (
    <ImageInput
      value={image}
      recommendedHeight={300}
      recommendedWidth={300}
      onChange={handleChange}
      className={classNames('mb-6', className)}
    />
  );
};
