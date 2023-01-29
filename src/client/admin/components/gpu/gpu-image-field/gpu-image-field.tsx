import { useImageCache } from '@client/shared/cache';
import { GpuImage } from '@shared/gpus';
import { Image } from '@shared/image';
import React, { FunctionComponent, useCallback } from 'react';
import { ImageInput } from '../../image';

interface GpuImageFieldProps {
  value?: GpuImage;
  onChange?: (value: GpuImage) => void;

  className?: string;
  ref?: unknown;
}

export const GpuImageField: FunctionComponent<GpuImageFieldProps> = (props) => {
  const { value, onChange, className } = props;
  const imageCache = useImageCache();

  const handleChange = useCallback(
    (image: Image) => {
      onChange?.(image != null ? { id: image.id } : null);
    },
    [onChange],
  );

  return (
    <ImageInput
      value={value != null ? imageCache.get(value.id) : null}
      recommendedHeight={300}
      recommendedWidth={300}
      onChange={handleChange}
      className={className}
    />
  );
};
