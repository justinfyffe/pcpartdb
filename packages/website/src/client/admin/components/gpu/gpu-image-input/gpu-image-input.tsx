import { useImageCache } from '@pcpartdb/website/client/shared/cache';
import { GpuImage } from '@pcpartdb/website/shared/gpus';
import { Image } from '@pcpartdb/website/shared/image';
import React, { FunctionComponent, useCallback } from 'react';
import { ImageInput } from '../../image';

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
