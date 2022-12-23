import { useImageCache } from '@client/shared/cache';
import { Image } from '@shared/image';
import { ProductImage } from '@shared/product-image';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ImageInput } from '../../image';

interface ProductImageFieldProps {
  value?: ProductImage;
  onChange?: (value: ProductImage) => void;

  className?: string;
  ref?: unknown;
}

export const ProductImageField: FunctionComponent<ProductImageFieldProps> = (
  props,
) => {
  const { value, onChange, className } = props;
  const imageCache = useImageCache();

  const [image, setImage] = useState<Image>(() => {
    if (value == null) {
      return null;
    }

    return value.image ?? imageCache.get(value.imageId);
  });

  // Strip "image" from value
  useEffect(() => {
    if (value?.image == null) {
      return;
    }

    onChange?.(
      value != null
        ? { imageId: value.imageId, metadata: value.metadata }
        : null,
    );
  }, [value, onChange]);

  const handleChange = useCallback(
    (image: Image) => {
      const newValue: ProductImage =
        image != null ? { imageId: image.id, metadata: value?.metadata } : null;

      onChange?.(newValue);
      setImage(image);
    },
    [value, onChange],
  );

  return (
    <ImageInput
      value={image}
      recommendedHeight={300}
      recommendedWidth={300}
      onChange={handleChange}
      className={className}
    />
  );
};
