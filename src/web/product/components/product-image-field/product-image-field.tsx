import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Image } from '../../../../types/image';
import {
  ProductImage,
  ProductImageType,
} from '../../../../types/product-image';
import { ImageInput } from '../../../image/components/image-input';
import { classNames } from '../../../shared/ui/ui.utils';

interface ProductImageFieldProps {
  type: ProductImageType;

  value?: ProductImage;
  onChange?: (value: ProductImage) => void;

  className?: string;
  ref?: unknown;
}

export const ProductImageField: FunctionComponent<ProductImageFieldProps> = (
  props,
) => {
  const { type, value: propsValue, onChange, className } = props;

  // Remove the image property from the value
  useEffect(() => {
    if (propsValue?.image == null) {
      return;
    }

    onChange?.(
      propsValue
        ? { type: propsValue.type, imageId: propsValue.imageId }
        : null,
    );
  }, [propsValue, onChange]);

  const [image, setImage] = useState<Image>(() => propsValue?.image ?? null);

  const handleChange = useCallback(
    (image: Image) => {
      const newValue = { type, imageId: image?.id };

      onChange?.(newValue);
      setImage(image);
    },
    [onChange, type],
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
