import { useImageCache } from '@client/shared/cache';
import { Image } from '@shared/image';
import { PartImage } from '@shared/part-image';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ImageInput } from '../../image';

interface PartImageFieldProps {
  value?: PartImage;
  onChange?: (value: PartImage) => void;

  className?: string;
  ref?: unknown;
}

export const PartImageField: FunctionComponent<PartImageFieldProps> = (
  props,
) => {
  const { value, onChange, className } = props;
  const imageCache = useImageCache();

  const [image, setImage] = useState<Image>(() => {
    if (value == null) {
      return null;
    }

    return value.image ?? imageCache.get(value.id);
  });

  // Strip "image" from value
  useEffect(() => {
    if (value?.image == null) {
      return;
    }

    onChange?.(
      value != null ? { id: value.id, metadata: value.metadata } : null,
    );
  }, [value, onChange]);

  const handleChange = useCallback(
    (image: Image) => {
      const newValue: PartImage =
        image != null ? { id: image.id, metadata: value?.metadata } : null;

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
