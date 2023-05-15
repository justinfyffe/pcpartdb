import { Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent, useMemo, useState } from 'react';
import { getCompanyLogoAutocompletePath, getImagePath } from '../../../image';
import { Img } from '../../../shared/components';
import { classNames } from '../../../shared/ui';
import { GpuImageOption } from './GpuImageOption';

interface GpuImagesProps {
  gpu: Gpu;

  className?: string;
}

export const GpuImages: FunctionComponent<GpuImagesProps> = (props) => {
  const { gpu, className } = props;

  const [selected, setSelected] = useState(0);

  const images = useMemo(() => {
    const gpuImages = gpu.images ?? [];
    const companyImage = getCompanyLogoAutocompletePath(gpu);
    const images = gpuImages
      .filter((image) => image?.image != null)
      .map(({ image }) => getImagePath(image));

    if (companyImage != null) {
      images.push(companyImage);
    }

    return images;
  }, [gpu]);

  if (images.length === 0) {
    return <></>;
  }

  return (
    <div
      className={classNames(
        'flex flex-col gap-3 mx-auto items-start justify-start w-full',
        className,
      )}
    >
      <div className="bg-slate-50 flex items-center justify-center rounded w-full h-80 p-4">
        <Img
          className="mx-auto h-auto max-h-full w-auto"
          src={images[selected]}
        />
      </div>

      <div className="flex flex-wrap w-full gap-4">
        {images.map((image, i) => (
          <GpuImageOption
            key={i}
            src={image}
            onClick={() => setSelected(i)}
            className={selected === i ? 'border-px border-black' : ''}
          />
        ))}
      </div>
    </div>
  );
};
