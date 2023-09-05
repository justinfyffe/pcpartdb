import { GpuImage, Image } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback } from 'react';
import { useImageCache } from '../../../../shared/cache/ImageCache';
import { ImageInput } from '../../image/ImageInput/ImageInput';

interface GpuImageInputProps {
  value?: GpuImage;
  onChange?: (value: GpuImage) => void;

  className?: string;
  ref?: unknown;
}

export const GpuImageInput: FunctionComponent<GpuImageInputProps> = (props) => {
  const { value, onChange, className } = props;
  const imageCache = useImageCache();

  const handleChange = useCallback(
    (image: Image) => {
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
